import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import type { RichDocument, RichNode } from "./types";

export const CONTENT_SCHEMA_VERSION = 1;
export const MAX_DOCUMENT_BYTES = 500_000;
export const emptyDocument = (): RichDocument => ({
  type: "doc",
  content: [{ type: "paragraph" }],
});
export function blogSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160)
    .replace(/-+$/g, "");
}
export function safeLink(value: unknown) {
  if (typeof value !== "string" || /[\u0000-\u0020\u007f]/.test(value))
    return false;
  if (/^\/(?!\/)/.test(value) || /^#[a-zA-Z0-9_-]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return ["https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}
export function safeImage(value: unknown) {
  return (
    typeof value === "string" &&
    (/^\/images\/real\/(large|small)\/DSC\d+\.webp$/.test(value) ||
      /^\/images\/blog\/[a-zA-Z0-9_-]+\.webp$/.test(value) ||
      /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/[a-zA-Z0-9_.,/:-]+$/.test(
        value,
      ))
  );
}
export function textContent(node: RichNode): string {
  if (node.type === "text") return node.text || "";
  return (node.content || [])
    .map(textContent)
    .join(
      ["doc", "paragraph", "heading", "listItem", "tableRow"].includes(
        node.type,
      )
        ? " "
        : "",
    );
}
export const readingMinutes = (doc: RichDocument) =>
  Math.max(
    1,
    Math.ceil(
      textContent(doc).trim().split(/\s+/).filter(Boolean).length / 220,
    ),
  );

const children: Record<string, string[]> = {
  doc: [
    "paragraph",
    "heading",
    "bulletList",
    "orderedList",
    "blockquote",
    "codeBlock",
    "horizontalRule",
    "image",
    "table",
  ],
  paragraph: ["text", "hardBreak"],
  heading: ["text", "hardBreak"],
  bulletList: ["listItem"],
  orderedList: ["listItem"],
  listItem: ["paragraph", "bulletList", "orderedList", "blockquote"],
  blockquote: ["paragraph", "heading", "bulletList", "orderedList"],
  codeBlock: ["text"],
  table: ["tableRow"],
  tableRow: ["tableCell", "tableHeader"],
  tableCell: ["paragraph", "heading", "bulletList", "orderedList"],
  tableHeader: ["paragraph", "heading"],
};
export function validateDocument(value: unknown): RichDocument {
  if (
    !value ||
    typeof value !== "object" ||
    JSON.stringify(value).length > MAX_DOCUMENT_BYTES
  )
    throw new Error("Article content is missing or exceeds 500 KB.");
  let count = 0;
  function visit(raw: unknown, depth: number, parent?: string): RichNode {
    if (depth > 16 || ++count > 12000 || !raw || typeof raw !== "object")
      throw new Error(
        "Article structure is too complex. Simplify nested lists or tables.",
      );
    const node = raw as RichNode;
    if (
      typeof node.type !== "string" ||
      (parent && !children[parent]?.includes(node.type)) ||
      (!parent && node.type !== "doc")
    )
      throw new Error("Unsupported article structure. Paste using the editor.");
    if (
      !(node.type in children) &&
      !["text", "hardBreak", "horizontalRule", "image"].includes(node.type)
    )
      throw new Error("Unsupported content node.");
    const clean: RichNode = { type: node.type };
    if (node.type === "text") {
      if (typeof node.text !== "string") throw new Error("Invalid text.");
      clean.text = node.text;
    }
    if (node.content !== undefined) {
      if (!Array.isArray(node.content) || !(node.type in children))
        throw new Error("Invalid nested content.");
      clean.content = node.content.map((n) => visit(n, depth + 1, node.type));
    }
    if (node.type in children && !clean.content) clean.content = [];
    if (
      [
        "bulletList",
        "orderedList",
        "listItem",
        "table",
        "tableRow",
        "tableCell",
        "tableHeader",
      ].includes(node.type) &&
      !clean.content?.length
    )
      throw new Error("Lists and tables cannot contain empty structural rows.");
    if (node.type === "heading") {
      const level = Number(node.attrs?.level || 2);
      if (![2, 3, 4].includes(level))
        throw new Error("Article sections must use H2, H3 or H4.");
      clean.attrs = { level };
    }
    if (node.type === "orderedList")
      clean.attrs = {
        start: Math.max(1, Math.min(10000, Number(node.attrs?.start) || 1)),
      };
    if (["tableCell", "tableHeader"].includes(node.type))
      clean.attrs = {
        colspan: Math.max(1, Math.min(20, Number(node.attrs?.colspan) || 1)),
        rowspan: Math.max(1, Math.min(100, Number(node.attrs?.rowspan) || 1)),
      };
    if (node.type === "image") {
      if (!safeImage(node.attrs?.src))
        throw new Error(
          "Use an image from the media library. External clipboard images need importing.",
        );
      clean.attrs = {
        src: node.attrs!.src,
        alt: String(node.attrs?.alt || "").slice(0, 500),
        caption: String(node.attrs?.caption || "").slice(0, 1000),
        width: Number(node.attrs?.width) || null,
        height: Number(node.attrs?.height) || null,
      };
    }
    if (node.marks !== undefined) {
      if (
        node.type !== "text" ||
        !Array.isArray(node.marks) ||
        node.marks.length > 8
      )
        throw new Error("Invalid text formatting.");
      clean.marks = node.marks.map((mark) => {
        if (
          !["bold", "italic", "underline", "strike", "code", "link"].includes(
            mark.type,
          )
        )
          throw new Error("Unsupported text style.");
        if (mark.type === "link") {
          if (!safeLink(mark.attrs?.href))
            throw new Error("Links must use a safe URL.");
          return {
            type: mark.type,
            attrs: {
              href: mark.attrs!.href,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          };
        }
        return { type: mark.type };
      });
    }
    return clean;
  }
  return visit(value, 0) as RichDocument;
}

export function cleanClipboardHTML(html: string): {
  html: string;
  warnings: string[];
  title: string;
} {
  if (html.length > MAX_DOCUMENT_BYTES)
    throw new Error("Paste less than 500 KB at a time.");
  const warnings: string[] = [];
  const titleMatch = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch
    ? sanitizeHtml(titleMatch[1], {
        allowedTags: [],
        allowedAttributes: {},
      }).trim()
    : "";
  const cleaned = sanitizeHtml(html, {
    allowedTags: [
      "h2",
      "h3",
      "h4",
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "figure",
      "figcaption",
      "pre",
      "code",
      "hr",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt", "data-caption"],
      ol: ["start"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      h1: "h2",
      h5: "h4",
      h6: "h4",
      b: "strong",
      i: "em",
      a: (_tag, attrs) => ({
        tagName: "a",
        attribs: safeLink(attrs.href) ? { href: attrs.href } : {},
      }),
      img: (_tag, attrs) => {
        if (!safeImage(attrs.src)) {
          warnings.push(
            "An external or embedded image needs importing. Its source is preserved as a note in the article.",
          );
          return {
            tagName: "p",
            text: `[Image needs importing: ${attrs.alt || ""} ${attrs.src || "clipboard file"}]`,
            attribs: {},
          };
        }
        return {
          tagName: "img",
          attribs: {
            src: attrs.src,
            alt: attrs.alt || "",
            "data-caption": attrs["data-caption"] || "",
          },
        };
      },
    },
  });
  return { html: cleaned, title, warnings: [...new Set(warnings)] };
}
export function preparePaste(
  text: string,
  html = "",
  mode: "auto" | "plain" | "markdown" = "auto",
) {
  if (text.length > MAX_DOCUMENT_BYTES)
    throw new Error("Paste less than 500 KB at a time.");
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (mode === "plain")
    return {
      html: text
        .split(/\r?\n\s*\n/)
        .map((p) => `<p>${escape(p).replace(/\r?\n/g, "<br>")}</p>`)
        .join(""),
      warnings: [],
      title: "",
    };
  if (mode === "auto" && html.trim()) return cleanClipboardHTML(html);
  let input = text.replace(/\r\n?/g, "\n");
  if (input.length > MAX_DOCUMENT_BYTES)
    throw new Error("Paste less than 500 KB at a time.");
  // Only infer a plain-text heading from a short title-like standalone line followed by a substantial paragraph.
  if (mode === "auto" && !/^#{1,6}\s/m.test(input)) {
    input = input.replace(
      /(^|\n\n)([A-Z][^\n.!?:]{3,65})\n\n(?=\S[^\n]{100})/g,
      (_all, lead, line) => {
        const words = line.split(/\s+/);
        const titleLike =
          words.length >= 2 &&
          words.length <= 9 &&
          words.filter((w: string) => /^[A-Z]/.test(w)).length >=
            Math.ceil(words.length * 0.7);
        return `${lead}${titleLike ? "## " : ""}${line}\n\n`;
      },
    );
  }
  return cleanClipboardHTML(
    String(marked.parse(input, { gfm: true, async: false })),
  );
}
export function articleHeadings(doc: RichDocument) {
  const counts = new Map<string, number>();
  return doc.content
    .filter((n) => n.type === "heading")
    .map((n) => {
      const base = blogSlug(textContent(n)) || "section";
      const count = (counts.get(base) || 0) + 1;
      counts.set(base, count);
      return {
        id: count === 1 ? base : `${base}-${count}`,
        text: textContent(n),
        level: Number(n.attrs?.level || 2),
      };
    });
}
export function fromMarkdownSimple(markdown: string): RichDocument {
  return {
    type: "doc",
    content: markdown
      .split(/\n\n+/)
      .filter(Boolean)
      .map((block) =>
        /^##? /.test(block)
          ? {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: block.replace(/^#+ /, "") }],
            }
          : { type: "paragraph", content: [{ type: "text", text: block }] },
      ),
  };
}
