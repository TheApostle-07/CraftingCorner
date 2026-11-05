"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Save,
  Eye,
  ArrowLeft,
  Check,
  Loader2,
  History,
  ImagePlus,
  Download,
} from "lucide-react";
import type { Article, ArticleFields, BlogOptions } from "@/lib/blog/types";
import { blogSlug, readingMinutes, textContent } from "@/lib/blog/content";
import {
  kolkataToUTC,
  publishingIssues,
  parseArticleFields,
} from "@/lib/blog/validation";
import ArticleBody from "@/components/blog/ArticleBody";
import { ArticleStatus } from "./BlogDashboard";
import { blogRequest } from "./api";
import Dialog from "./Dialog";
import MediaLibrary from "./MediaLibrary";

const RichEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[500px] animate-pulse rounded-xl bg-[#eee7dc]"
      role="status"
      aria-label="Loading editor"
    />
  ),
});
function fieldsOf(a: Article): ArticleFields {
  return Object.fromEntries(
    [
      "title",
      "slug",
      "subtitle",
      "excerpt",
      "content",
      "contentSchemaVersion",
      "categorySlug",
      "authorId",
      "coverImageId",
      "coverAlt",
      "featured",
      "tags",
      "seoTitle",
      "seoDescription",
      "canonicalUrl",
      "ogImageId",
      "focusKeyword",
      "relatedProductSlugs",
      "noIndex",
    ].map((key) => [key, a[key as keyof Article]]),
  ) as ArticleFields;
}
function Panel({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="blog-panel" open={open}>
      <summary className="cursor-pointer text-sm font-semibold">
        {title}
      </summary>
      <div className="mt-5 space-y-5">{children}</div>
    </details>
  );
}
type Action =
  | "save"
  | "publish"
  | "schedule"
  | "unpublish"
  | "archive"
  | "restore"
  | "delete"
  | "restore-revision";
type Revision = { revision: number; createdAt: string; actor: string };
export default function ArticleEditor({
  initial,
  options,
  products,
}: {
  initial: Article;
  options: BlogOptions;
  products: { slug: string; title: string }[];
}) {
  const [article, setArticle] = useState(initial),
    [fields, setFields] = useState<ArticleFields>(() => fieldsOf(initial));
  const initialRecord = useRef(initial);
  const failedAttempt = useRef<{
    body: string;
    snapshot: ArticleFields;
    action: Action;
  } | null>(null);
  const [selectedCover, setSelectedCover] = useState<
    BlogOptions["media"][number] | null
  >(null);
  const current = useRef(fields);
  current.current = fields;
  const record = useRef(article);
  record.current = article;
  const saved = useRef(JSON.stringify(fieldsOf(initial))),
    working = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("All changes saved."),
    [paused, setPaused] = useState(false),
    [conflict, setConflict] = useState(false);
  const [media, setMedia] = useState<"cover" | "og" | null>(null),
    [preview, setPreview] = useState(false),
    [confirmation, setConfirmation] = useState<Action | null>(null),
    [schedule, setSchedule] = useState(false),
    [scheduledTime, setScheduledTime] = useState("");
  const [revisions, setRevisions] = useState<Revision[] | null>(null),
    [restoreRevision, setRestoreRevision] = useState<number | null>(null),
    [recovery, setRecovery] = useState<ArticleFields | null>(null),
    [leaving, setLeaving] = useState<string | null>(null);
  const [editorVersion, setEditorVersion] = useState(0);
  const serialized = JSON.stringify(fields),
    dirty = serialized !== saved.current;
  const storageKey = `cc-blog-draft-${initial.id}`;
  const set = <K extends keyof ArticleFields>(
    key: K,
    value: ArticleFields[K],
  ) => setFields((f) => ({ ...f, [key]: value }));
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current.current, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${current.current.slug || "article"}-draft.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        local?.fields &&
        JSON.stringify(local.fields) !==
          JSON.stringify(fieldsOf(initialRecord.current))
      )
        setRecovery(parseArticleFields(local.fields));
    } catch {
      /* Recovery is optional; database content remains authoritative. */
    }
  }, [storageKey]);
  useEffect(() => {
    if (recovery) return;
    const timer = setTimeout(() => {
      try {
        if (dirty)
          localStorage.setItem(
            storageKey,
            JSON.stringify({ fields, savedRevision: article.revision }),
          );
        else localStorage.removeItem(storageKey);
      } catch {
        /* Private browsing or a full device must not block server saves. */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [fields, dirty, storageKey, article.revision, recovery]);
  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (dirty || working.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const navigate = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest("a");
      if (
        !a ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.getAttribute("href")?.startsWith("#") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      )
        return;
      if (dirty || working.current) {
        e.preventDefault();
        e.stopPropagation();
        setLeaving(a.href);
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty]);
  useEffect(
    () => () => {
      try {
        if (JSON.stringify(current.current) !== saved.current)
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              fields: current.current,
              savedRevision: record.current.revision,
            }),
          );
      } catch {
        /* Keep server saves independent of device storage. */
      }
    },
    [storageKey],
  );
  async function persist(
    action: Action = "save",
    extra: { scheduledAt?: string; restoreRevision?: number } = {},
  ) {
    if (working.current || conflict) return false;
    if (["publish", "schedule"].includes(action)) {
      const issues = publishingIssues(current.current);
      if (issues.length) {
        setError(issues.join(" "));
        return false;
      }
    }
    working.current = true;
    setBusy(true);
    setError("");
    setMessage(action === "save" ? "Saving your draft…" : "Updating article…");
    const attempt = failedAttempt.current || {
      body: JSON.stringify({
        action,
        revision: record.current.revision,
        mutationId: crypto.randomUUID(),
        fields: current.current,
        ...extra,
      }),
      snapshot: current.current,
      action,
    };
    const snapshot = attempt.snapshot;
    const effectiveAction = attempt.action;
    try {
      const result = await blogRequest<{ article: Article; message: string }>(
        `/articles/${initial.id}`,
        {
          method: "PATCH",
          body: attempt.body,
        },
      );
      const nextFields = fieldsOf(result.article);
      failedAttempt.current = null;
      saved.current = JSON.stringify(nextFields);
      record.current = result.article;
      setArticle(result.article);
      if (effectiveAction === "restore-revision")
        setEditorVersion((v) => v + 1);
      if (
        JSON.stringify(current.current) === JSON.stringify(snapshot) ||
        effectiveAction === "restore-revision"
      ) {
        current.current = nextFields;
        setFields(nextFields);
      }
      setMessage(
        effectiveAction !== action
          ? "Previous update confirmed. Review your draft before continuing."
          : result.message,
      );
      setPaused(false);
      setConfirmation(null);
      setSchedule(false);
      setRestoreRevision(null);
      setRevisions(null);
      return true;
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      failedAttempt.current = !status || status >= 500 ? attempt : null;
      setError((e as Error).message);
      setMessage("Not saved. Your text is preserved.");
      setPaused(true);
      if ((e as Error & { status?: number }).status === 409) setConflict(true);
      return false;
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(() => {
    if (!dirty || busy || paused || conflict || article.deletedAt || recovery)
      return;
    const timer = setTimeout(() => void persistRef.current("save"), 2500);
    return () => clearTimeout(timer);
  }, [serialized, dirty, busy, paused, conflict, article.deletedAt, recovery]);
  async function history() {
    try {
      const result = await blogRequest<{ revisions: Revision[] }>(
        `/articles/${initial.id}/revisions`,
      );
      setRevisions(result.revisions);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const cover =
    selectedCover?.id === fields.coverImageId
      ? selectedCover
      : options.media.find((m) => m.id === fields.coverImageId);
  const issues = publishingIssues(fields),
    words = textContent(fields.content).split(/\s+/).filter(Boolean).length;
  const seoWarnings = [
    ...issues,
    ...(!fields.seoDescription
      ? ["Add a search description for a more useful search preview."]
      : []),
    ...((fields.seoTitle || fields.title).length > 60
      ? ["The search title may be truncated. Aim for around 60 characters."]
      : []),
    ...(fields.seoDescription.length > 160
      ? [
          "The search description may be truncated. Aim for around 160 characters.",
        ]
      : []),
  ];
  const field = (
    label: string,
    key:
      | "subtitle"
      | "excerpt"
      | "coverAlt"
      | "seoTitle"
      | "seoDescription"
      | "canonicalUrl"
      | "focusKeyword",
    multiline = false,
  ) => (
    <label className="blog-label">
      {label}
      {multiline ? (
        <textarea
          className="blog-input"
          rows={3}
          value={fields[key]}
          onChange={(e) => set(key, e.target.value)}
          maxLength={
            key === "excerpt"
              ? 1500
              : key === "canonicalUrl"
                ? 2048
                : key === "seoDescription"
                  ? 1000
                  : 500
          }
        />
      ) : (
        <input
          className="blog-input"
          value={fields[key]}
          onChange={(e) => set(key, e.target.value)}
          maxLength={key === "canonicalUrl" ? 2048 : 250}
        />
      )}
    </label>
  );
  return (
    <div className="pb-24">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/blog"
            className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs text-[#796650]"
          >
            <ArrowLeft size={15} />
            All articles
          </Link>
          <h1 className="font-display text-4xl font-normal">
            {article.title ? "Refine your story" : "A new story"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ArticleStatus article={article} />
          <button
            onClick={history}
            className="editor-tool"
            aria-label="Revision history"
          >
            <History size={19} />
          </button>
          <button
            className="blog-secondary"
            onClick={() => setPreview((v) => !v)}
          >
            <Eye size={16} />
            {preview ? "Edit article" : "Reading view"}
          </button>
          <a
            className="blog-secondary"
            href={`/admin/blog/preview/${initial.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Saved preview
          </a>
        </div>
      </header>
      {error ? (
        <div role="alert" className="blog-error mb-5">
          <p>{error}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {!conflict ? (
              <button
                className="blog-secondary"
                disabled={busy}
                onClick={() => persist()}
              >
                Retry save
              </button>
            ) : (
              <button
                className="blog-secondary"
                onClick={() => setLeaving(window.location.href)}
              >
                Reload latest version
              </button>
            )}
            <button className="blog-secondary" onClick={download}>
              <Download size={15} />
              Download my draft
            </button>
            {error.includes("sign in") || error.includes("session") ? (
              <a
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="blog-secondary"
              >
                Sign in again
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
      {article.live ? (
        <p className="blog-notice mb-6">
          A version of this story is live. Changes here stay private until you
          choose Publish changes.
          {article.status === "scheduled"
            ? " A saved snapshot is scheduled; further edits won’t change that snapshot unless you reschedule."
            : ""}
        </p>
      ) : article.status === "scheduled" ? (
        <p className="blog-notice mb-6">
          Publication scheduled for{" "}
          {new Date(article.scheduledAt!).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}{" "}
          IST. Further edits are a separate working draft; reschedule to include
          them.
        </p>
      ) : null}
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 space-y-6">
          <div className="blog-panel">
            <label className="blog-label">
              Article title
              <input
                className="blog-input !text-xl"
                placeholder="A thoughtful title for your story"
                value={fields.title}
                maxLength={250}
                onChange={(e) => {
                  const value = e.target.value;
                  setFields((f) => ({
                    ...f,
                    title: value,
                    ...(!article.live &&
                    (f.slug.startsWith("untitled-") ||
                      f.slug === blogSlug(f.title))
                      ? { slug: blogSlug(value) || f.slug }
                      : {}),
                  }));
                }}
              />
            </label>
            <div className="mt-5">
              {field("Subtitle (optional)", "subtitle")}
            </div>
          </div>
          {preview ? (
            <div className="blog-panel">
              <p className="mb-5 text-xs text-[#796650]">
                Reading view · working draft · {readingMinutes(fields.content)}{" "}
                min read
              </p>
              <h2 className="mb-6 font-display text-4xl">
                {fields.title || "Untitled article"}
              </h2>
              <ArticleBody document={fields.content} />
            </div>
          ) : (
            <RichEditor
              key={editorVersion}
              content={fields.content}
              onChange={(doc) => set("content", doc)}
              onTitle={(value) => {
                if (!current.current.title)
                  setFields((f) => ({
                    ...f,
                    title: value,
                    slug: blogSlug(value) || f.slug,
                  }));
              }}
            />
          )}
          <p className="text-xs leading-6 text-[#796650]">
            {words.toLocaleString()} words · {readingMinutes(fields.content)}{" "}
            min read. Paste formatted text directly, or choose Markdown / plain
            text from the toolbar. Review imported formatting and image
            descriptions before publishing.
          </p>
          <Panel title="Excerpt" open>
            {field(
              "A short introduction for article cards and readers",
              "excerpt",
              true,
            )}
          </Panel>
          <Panel title="Search & sharing">
            <label className="blog-label">
              Article URL slug
              <input
                value={fields.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="blog-input"
                maxLength={160}
              />
              <span className="text-xs font-normal leading-6 text-[#796650]">
                Lowercase words separated by hyphens. Previous published URLs
                redirect after republishing.
              </span>
            </label>
            {field("Search title", "seoTitle")}
            {field("Search description", "seoDescription", true)}
            {field("Focus topic (editorial reminder)", "focusKeyword")}
            {field("Canonical HTTPS URL (optional)", "canonicalUrl")}
            <button className="blog-secondary" onClick={() => setMedia("og")}>
              Choose sharing image
            </button>
            {fields.ogImageId ? (
              <button
                className="blog-secondary ml-2"
                onClick={() => set("ogImageId", null)}
              >
                Use cover instead
              </button>
            ) : null}
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={fields.noIndex}
                onChange={(e) => set("noIndex", e.target.checked)}
              />
              Request search engines not to index this article
            </label>
            <div className="rounded-xl border border-[#e8dccb] bg-white p-5">
              <p className="text-xs text-[#796650] break-all">
                craftingcorner.in/blog/{fields.slug}
              </p>
              <p className="mt-2 text-lg text-[#245085]">
                {fields.seoTitle || fields.title || "Article title"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#66513e]">
                {fields.seoDescription ||
                  fields.excerpt ||
                  "Your search description will appear here."}
              </p>
              <p className="mt-3 text-xs text-[#796650]">
                Illustrative preview; search engines may rewrite titles and
                descriptions.
              </p>
            </div>
          </Panel>
          <Panel title="Related collection">
            <label className="blog-label">
              Choose relevant published products
              <select
                multiple
                className="blog-input min-h-44"
                value={fields.relatedProductSlugs}
                onChange={(e) =>
                  set(
                    "relatedProductSlugs",
                    Array.from(e.target.selectedOptions).map((o) => o.value),
                  )
                }
              >
                {products.map((p) => (
                  <option value={p.slug} key={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs leading-6 text-[#796650]">
              Use Ctrl / Command to select multiple items, up to 12. Only
              connect pieces that genuinely relate to the story.
            </p>
          </Panel>
        </section>
        <aside className="min-w-0 space-y-5">
          <Panel title="Publication" open>
            <label className="blog-label">
              Category
              <select
                className="blog-input"
                value={fields.categorySlug}
                onChange={(e) => set("categorySlug", e.target.value)}
              >
                <option value="">Choose category</option>
                {options.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="blog-label">
              Author
              <select
                className="blog-input"
                value={fields.authorId}
                onChange={(e) => set("authorId", e.target.value)}
              >
                <option value="">Choose author</option>
                {options.authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={fields.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Feature this article
            </label>
            <label className="blog-label">
              Tags (comma separated)
              <input
                className="blog-input"
                value={fields.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value.split(",").map((t) => t.trimStart()),
                  )
                }
              />
            </label>
            <button
              className="blog-secondary w-full"
              disabled={busy || conflict || Boolean(article.deletedAt)}
              onClick={() => setSchedule(true)}
            >
              Schedule publication
            </button>
            <p className="text-xs leading-6 text-[#796650]">
              Schedules use India Standard Time. A scheduled story becomes
              available on the first request after its due time.
            </p>
          </Panel>
          <Panel title="Cover photograph" open>
            {cover ? (
              <img
                src={cover.url}
                alt={fields.coverAlt || ""}
                className="aspect-[4/3] w-full rounded-xl bg-[#eee7dc] object-contain"
              />
            ) : fields.coverImageId ? (
              <p className="text-xs leading-6">
                A newly uploaded cover is selected. Save and refresh to update
                its thumbnail.
              </p>
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-xl bg-[#eee7dc]">
                <ImagePlus className="text-[#a7865e]" size={32} />
              </div>
            )}
            <button
              className="blog-secondary w-full"
              onClick={() => setMedia("cover")}
            >
              {fields.coverImageId ? "Change photograph" : "Choose photograph"}
            </button>
            {field("Cover alt text", "coverAlt", true)}
            <p className="text-xs leading-6 text-[#796650]">
              Describe what is visible, not a keyword list. The full photograph
              is preserved without cropping.
            </p>
          </Panel>
          <Panel title="Before you publish" open>
            {seoWarnings.length ? (
              <ul className="space-y-3 text-xs leading-6 text-[#796650]">
                {seoWarnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            ) : (
              <p className="flex gap-2 text-xs leading-6 text-[#267144]">
                <Check size={17} />
                Required details are complete.
              </p>
            )}
            <p className="text-xs leading-6 text-[#796650]">
              Review accuracy, permissions and contact details. SEO checks are
              editorial guidance, not a ranking guarantee.
            </p>
          </Panel>
          <Panel title="Article history & actions">
            <p className="text-xs leading-6 text-[#796650]">
              Revision {article.revision}
              <br />
              Last saved by {article.lastEditedBy}
              <br />
              {new Date(article.updatedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}{" "}
              IST
            </p>
            <button className="blog-secondary w-full" onClick={history}>
              View revision history
            </button>
            {article.deletedAt ? (
              <button
                className="blog-secondary w-full"
                onClick={() => setConfirmation("restore")}
              >
                Restore to drafts
              </button>
            ) : (
              <>
                {article.live || article.status === "scheduled" ? (
                  <button
                    className="blog-secondary w-full"
                    onClick={() => setConfirmation("unpublish")}
                  >
                    Unpublish / cancel schedule
                  </button>
                ) : null}
                <button
                  className="blog-secondary w-full"
                  onClick={() => setConfirmation("archive")}
                >
                  Archive article
                </button>
                <button
                  className="blog-secondary w-full !text-[#9c3434]"
                  onClick={() => setConfirmation("delete")}
                >
                  Move to trash
                </button>
              </>
            )}
          </Panel>
        </aside>
      </div>
      <footer className="blog-savebar">
        <span
          role="status"
          className="flex min-w-0 items-center gap-2 text-xs leading-5 text-[#66513e]"
        >
          {busy ? (
            <Loader2 size={15} className="shrink-0 animate-spin" />
          ) : (
            <Check size={15} className="shrink-0" />
          )}
          {busy || paused ? message : dirty ? "Unsaved changes" : message}
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            disabled={busy || conflict || Boolean(article.deletedAt)}
            className="blog-secondary"
            onClick={() => persist()}
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save draft</span>
            <span className="sm:hidden">Save</span>
          </button>
          <button
            disabled={busy || conflict || Boolean(article.deletedAt)}
            className="site-button"
            onClick={() => persist("publish")}
          >
            {article.live ? "Publish changes" : "Publish"}
          </button>
        </div>
      </footer>
      {media ? (
        <Dialog
          title={
            media === "cover"
              ? "Choose cover photograph"
              : "Choose sharing photograph"
          }
          onClose={() => setMedia(null)}
        >
          <MediaLibrary
            onSelect={(image) => {
              if (media === "cover") {
                setSelectedCover(image);
                setFields((f) => ({
                  ...f,
                  coverImageId: image.id,
                  coverAlt: image.alt,
                }));
              } else set("ogImageId", image.id);
              setMedia(null);
            }}
          />
        </Dialog>
      ) : null}
      {confirmation ? (
        <Dialog
          title={
            confirmation === "delete"
              ? "Move article to trash?"
              : confirmation === "unpublish"
                ? "Remove public access?"
                : confirmation === "archive"
                  ? "Archive this story?"
                  : "Restore article?"
          }
          onClose={() => !busy && setConfirmation(null)}
        >
          <p className="text-sm leading-7 text-[#66513e]">
            {confirmation === "restore"
              ? "This article will return as a private draft. It will not be republished automatically."
              : "The article will no longer be publicly available. Its content and revision history will be retained."}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className="site-button"
              disabled={busy}
              onClick={() => persist(confirmation)}
            >
              Confirm
            </button>
            <button
              className="blog-secondary"
              disabled={busy}
              onClick={() => setConfirmation(null)}
            >
              Cancel
            </button>
          </div>
          {error ? (
            <p role="alert" className="blog-error mt-4">
              {error}
            </p>
          ) : null}
        </Dialog>
      ) : null}
      {schedule ? (
        <Dialog
          title="Schedule this story"
          onClose={() => !busy && setSchedule(false)}
        >
          <label className="blog-label">
            Publication date & time · Asia/Kolkata
            <input
              type="datetime-local"
              className="blog-input"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </label>
          <p className="my-5 text-xs leading-6 text-[#796650]">
            The current draft is saved as the scheduled version. Later edits
            remain separate until you schedule again or publish.
          </p>
          <button
            className="site-button"
            disabled={busy || !scheduledTime}
            onClick={() => {
              try {
                void persist("schedule", {
                  scheduledAt: kolkataToUTC(scheduledTime),
                });
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Schedule publication
          </button>
          {error ? (
            <p role="alert" className="blog-error mt-4">
              {error}
            </p>
          ) : null}
        </Dialog>
      ) : null}
      {revisions ? (
        <Dialog title="Revision history" onClose={() => setRevisions(null)}>
          {revisions.length ? (
            <ul className="space-y-3">
              {revisions.map((r) => (
                <li
                  key={r.revision}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e8dccb] p-4"
                >
                  <span className="text-xs leading-6">
                    Revision {r.revision} · {r.actor}
                    <br />
                    {new Date(r.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                  <button
                    className="blog-secondary"
                    onClick={() => setRestoreRevision(r.revision)}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#796650]">
              Previous versions appear after your first save.
            </p>
          )}
          {restoreRevision ? (
            <div className="blog-notice mt-5">
              <p>
                Restore revision {restoreRevision} as a draft? This also removes
                the current public version. Download any unsaved text first.
              </p>
              <button
                className="site-button mt-4"
                disabled={busy}
                onClick={() => persist("restore-revision", { restoreRevision })}
              >
                Restore as draft
              </button>
            </div>
          ) : null}
        </Dialog>
      ) : null}
      {recovery ? (
        <Dialog title="Recover unsaved work?" onClose={() => setRecovery(null)}>
          <p className="text-sm leading-7 text-[#66513e]">
            This device has a more recent working draft. The database version
            remains unchanged until you save.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="site-button"
              onClick={() => {
                setFields(recovery);
                setPreview(true);
                setPaused(true);
                setMessage("Recovered draft. Review and save when ready.");
                setRecovery(null);
              }}
            >
              Recover draft
            </button>
            <button
              className="blog-secondary"
              onClick={() => {
                localStorage.removeItem(storageKey);
                setRecovery(null);
              }}
            >
              Keep saved version
            </button>
          </div>
        </Dialog>
      ) : null}
      {leaving ? (
        <Dialog title="Leave this draft?" onClose={() => setLeaving(null)}>
          <p className="text-sm leading-7 text-[#66513e]">
            Some changes may not be saved. Download a copy or wait for a
            successful save before leaving.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="blog-secondary" onClick={download}>
              Download draft
            </button>
            <button
              className="site-button"
              onClick={() => {
                window.location.assign(leaving);
              }}
            >
              Leave page
            </button>
            <button className="blog-secondary" onClick={() => setLeaving(null)}>
              Keep editing
            </button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
