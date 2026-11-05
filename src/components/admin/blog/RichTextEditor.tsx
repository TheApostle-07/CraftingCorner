"use client";
import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImagePlus,
  Table2,
  Minus,
  Undo2,
  Redo2,
  ClipboardPaste,
  Code,
  Trash2,
} from "lucide-react";
import { cleanClipboardHTML, preparePaste, safeLink } from "@/lib/blog/content";
import type { RichDocument } from "@/lib/blog/types";
import MediaLibrary, { uploadMediaFile } from "./MediaLibrary";
import Dialog from "./Dialog";

const CaptionImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attrs) => ({ "data-caption": attrs.caption }),
      },
      width: { default: null },
      height: { default: null },
    };
  },
});
export default function RichTextEditor({
  content,
  onChange,
  onTitle,
}: {
  content: RichDocument;
  onChange: (document: RichDocument) => void;
  onTitle: (title: string) => void;
}) {
  const changed = useRef(onChange),
    title = useRef(onTitle);
  changed.current = onChange;
  title.current = onTitle;
  const [notice, setNotice] = useState("");
  const [media, setMedia] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState<"plain" | "markdown" | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [imageDetails, setImageDetails] = useState<{
    alt: string;
    caption: string;
  } | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: false },
      }),
      CaptionImage.configure({ allowBase64: false }),
      TableKit,
      Placeholder.configure({
        placeholder: "Paste an article here, or start writing…",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => changed.current(editor.getJSON() as RichDocument),
    editorProps: {
      attributes: {
        class: "article-prose blog-writing-surface",
        role: "textbox",
        "aria-label": "Article content",
        "aria-multiline": "true",
      },
      transformPastedHTML: (html) => cleanClipboardHTML(html).html,
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files;
        if (files?.length) {
          event.preventDefault();
          setNotice("Uploading clipboard photograph…");
          void uploadMediaFile(files[0])
            .then((image) => {
              const node = view.state.schema.nodes.image.create({
                src: image.url,
                alt: image.alt,
                caption: image.caption,
                width: image.width,
                height: image.height,
              });
              view.dispatch(view.state.tr.replaceSelectionWith(node));
              setNotice(
                "Photograph added. Add meaningful alt text before publishing.",
              );
            })
            .catch((e) => setNotice(e.message));
          return true;
        }
        const raw = event.clipboardData?.getData("text/plain") || "";
        let html = event.clipboardData?.getData("text/html") || "";
        if (!raw && !html) return false;
        try {
          if (html) {
            const doc = new DOMParser().parseFromString(html, "text/html");
            doc.querySelectorAll("span[style],p[style]").forEach((el) => {
              const style = (el as HTMLElement).style;
              if (
                Number(style.fontWeight) >= 600 ||
                style.fontWeight === "bold"
              )
                el.innerHTML = `<strong>${el.innerHTML}</strong>`;
              if (style.fontStyle === "italic")
                el.innerHTML = `<em>${el.innerHTML}</em>`;
            });
            doc.querySelectorAll("figure").forEach((figure) => {
              const image = figure.querySelector("img"),
                caption = figure.querySelector("figcaption");
              if (image && caption)
                image.setAttribute("data-caption", caption.textContent || "");
            });
            html = doc.body.innerHTML;
          }
          const prepared = preparePaste(raw, html, "auto");
          if (prepared.title)
            title.current(
              new DOMParser().parseFromString(prepared.title, "text/html").body
                .textContent || prepared.title,
            );
          setNotice(
            prepared.warnings.join(" ") ||
              "Pasted formatting preserved. Use Undo to revert the entire paste.",
          );
          event.preventDefault();
          editor?.chain().focus().insertContent(prepared.html).run();
          return true;
        } catch (error) {
          setNotice((error as Error).message);
          return true;
        }
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        event.preventDefault();
        const at = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })?.pos;
        setNotice("Uploading photograph…");
        void uploadMediaFile(files[0])
          .then((image) => {
            editor
              ?.chain()
              .focus()
              .insertContentAt(at ?? view.state.selection.from, {
                type: "image",
                attrs: {
                  src: image.url,
                  alt: image.alt,
                  caption: image.caption,
                  width: image.width,
                  height: image.height,
                },
              })
              .run();
            setNotice("Photograph added. Select it and add alt text.");
          })
          .catch((e) => setNotice(e.message));
        return true;
      },
    },
  });
  const selection = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            bullet: editor.isActive("bulletList"),
            ordered: editor.isActive("orderedList"),
            table: editor.isActive("table"),
            image: editor.isActive("image"),
            heading: editor.getAttributes("heading").level || 0,
          }
        : null,
  });
  if (!editor)
    return (
      <div
        className="min-h-[480px] animate-pulse rounded-xl bg-[#eee7dc]"
        role="status"
        aria-label="Loading article editor"
      />
    );
  const tool = (
    label: string,
    Icon: typeof Bold,
    action: () => void,
    active = false,
    disabled = false,
  ) => (
    <button
      key={label}
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={action}
      className={`editor-tool ${active ? "bg-[#e8dccb] text-[#38291f]" : ""}`}
    >
      <Icon size={17} />
    </button>
  );
  return (
    <div className="overflow-visible rounded-xl border border-[#ded3c5] bg-white">
      <div
        role="toolbar"
        aria-label="Article formatting"
        className="sticky top-0 z-20 flex flex-wrap items-center gap-1 rounded-t-xl border-b border-[#ded3c5] bg-[#faf7f1] p-2"
      >
        <label className="sr-only" htmlFor="heading-level">
          Paragraph or heading
        </label>
        <select
          id="heading-level"
          aria-label="Paragraph or heading"
          value={selection?.heading || 0}
          onChange={(e) => {
            const level = Number(e.target.value);
            if (level)
              editor
                .chain()
                .focus()
                .setHeading({ level: level as 2 | 3 | 4 })
                .run();
            else editor.chain().focus().setParagraph().run();
          }}
          className="min-h-11 max-w-[125px] rounded bg-transparent px-2 text-sm"
        >
          <option value="0">Paragraph</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
        {tool(
          "Bold",
          Bold,
          () => {
            editor.chain().focus().toggleBold().run();
          },
          selection?.bold,
        )}
        {tool(
          "Italic",
          Italic,
          () => {
            editor.chain().focus().toggleItalic().run();
          },
          selection?.italic,
        )}
        {tool(
          "Underline",
          Underline,
          () => {
            editor.chain().focus().toggleUnderline().run();
          },
          selection?.underline,
        )}
        {tool(
          "Bullet list",
          List,
          () => {
            editor.chain().focus().toggleBulletList().run();
          },
          selection?.bullet,
        )}
        {tool(
          "Numbered list",
          ListOrdered,
          () => {
            editor.chain().focus().toggleOrderedList().run();
          },
          selection?.ordered,
        )}
        {tool(
          "Block quote",
          Quote,
          () => {
            editor.chain().focus().toggleBlockquote().run();
          },
          editor.isActive("blockquote"),
        )}
        {tool(
          "Inline code",
          Code,
          () => {
            editor.chain().focus().toggleCode().run();
          },
          editor.isActive("code"),
        )}
        {tool(
          "Insert or edit link",
          LinkIcon,
          () => setLink(editor.getAttributes("link").href || ""),
          editor.isActive("link"),
        )}
        {tool("Insert photograph", ImagePlus, () => setMedia(true))}
        {tool("Insert table", Table2, () => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        })}
        {tool("Divider", Minus, () => {
          editor.chain().focus().setHorizontalRule().run();
        })}
        {tool(
          "Undo",
          Undo2,
          () => {
            editor.chain().focus().undo().run();
          },
          false,
          !editor.can().undo(),
        )}
        {tool(
          "Redo",
          Redo2,
          () => {
            editor.chain().focus().redo().run();
          },
          false,
          !editor.can().redo(),
        )}
        {tool("Paste Markdown or plain text", ClipboardPaste, () =>
          setPasteMode("markdown"),
        )}
      </div>
      {notice ? (
        <div
          role="status"
          className="border-b border-[#ded3c5] bg-[#f7f1e8] px-4 py-3 text-xs leading-6 text-[#66513e]"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss editor notice"
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {selection?.table ? (
        <div className="flex flex-wrap gap-2 border-b border-[#ded3c5] p-2">
          {[
            ["Add row", () => editor.chain().focus().addRowAfter().run()],
            ["Add column", () => editor.chain().focus().addColumnAfter().run()],
            ["Delete row", () => editor.chain().focus().deleteRow().run()],
            [
              "Delete column",
              () => editor.chain().focus().deleteColumn().run(),
            ],
            ["Remove table", () => editor.chain().focus().deleteTable().run()],
          ].map(([label, action]) => (
            <button
              type="button"
              key={String(label)}
              onClick={() => {
                (action as () => void)();
              }}
              className="blog-secondary text-xs"
            >
              {String(label)}
            </button>
          ))}
        </div>
      ) : null}
      {selection?.image ? (
        <div className="flex gap-3 border-b border-[#ded3c5] p-3">
          <button
            type="button"
            className="blog-secondary"
            onClick={() => {
              const a = editor.getAttributes("image");
              setImageDetails({ alt: a.alt || "", caption: a.caption || "" });
            }}
          >
            Image alt text & caption
          </button>
          {tool("Remove selected image", Trash2, () => {
            editor.chain().focus().deleteSelection().run();
          })}
        </div>
      ) : null}
      <EditorContent editor={editor} />
      {link !== null ? (
        <Dialog title="Article link" onClose={() => setLink(null)}>
          <label className="blog-label">
            URL
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products or https://…"
              className="blog-input"
            />
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="site-button"
              disabled={Boolean(link && !safeLink(link))}
              onClick={() => {
                if (link)
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: link })
                    .run();
                else editor.chain().focus().unsetLink().run();
                setLink(null);
              }}
            >
              Apply link
            </button>
            <button
              className="blog-secondary"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setLink(null);
              }}
            >
              Remove link
            </button>
          </div>
        </Dialog>
      ) : null}
      {media ? (
        <Dialog title="Choose a photograph" onClose={() => setMedia(false)}>
          <MediaLibrary
            onSelect={(image) => {
              editor
                .chain()
                .focus()
                .setImage({
                  src: image.url,
                  alt: image.alt,
                  width: image.width,
                  height: image.height,
                  ...{ caption: image.caption },
                })
                .run();
              setMedia(false);
            }}
          />
        </Dialog>
      ) : null}
      {imageDetails ? (
        <Dialog title="Image description" onClose={() => setImageDetails(null)}>
          <label className="blog-label">
            Alt text
            <textarea
              value={imageDetails.alt}
              onChange={(e) =>
                setImageDetails({ ...imageDetails, alt: e.target.value })
              }
              className="blog-input"
            />
          </label>
          <label className="blog-label mt-5">
            Caption
            <textarea
              value={imageDetails.caption}
              onChange={(e) =>
                setImageDetails({ ...imageDetails, caption: e.target.value })
              }
              className="blog-input"
            />
          </label>
          <button
            className="site-button mt-5"
            onClick={() => {
              editor
                .chain()
                .focus()
                .updateAttributes("image", imageDetails)
                .run();
              setImageDetails(null);
            }}
          >
            Apply description
          </button>
        </Dialog>
      ) : null}
      {pasteMode ? (
        <Dialog title="Paste article text" onClose={() => setPasteMode(null)}>
          <div className="mb-4 flex gap-3">
            <button
              className="blog-secondary"
              onClick={() => setPasteMode("markdown")}
              aria-pressed={pasteMode === "markdown"}
            >
              Markdown
            </button>
            <button
              className="blog-secondary"
              onClick={() => setPasteMode("plain")}
              aria-pressed={pasteMode === "plain"}
            >
              Plain text
            </button>
          </div>
          <label className="blog-label">
            Text to insert
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={12}
              maxLength={500000}
              className="blog-input font-mono text-sm"
            />
          </label>
          <p className="mt-3 text-xs leading-6 text-[#796650]">
            Inserts at your current position. Existing content is preserved; one
            Undo reverts this paste.
          </p>
          <button
            className="site-button mt-5"
            onClick={() => {
              try {
                const prepared = preparePaste(pasteText, "", pasteMode);
                if (prepared.title) title.current(prepared.title);
                editor.chain().focus().insertContent(prepared.html).run();
                setNotice(prepared.warnings.join(" "));
                setPasteMode(null);
                setPasteText("");
              } catch (e) {
                setNotice((e as Error).message);
              }
            }}
          >
            Insert formatted content
          </button>
        </Dialog>
      ) : null}
    </div>
  );
}
