"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowUpRight, Copy, Pencil, BookOpen } from "lucide-react";
import type { listAdminArticles } from "@/lib/blog/service";
import type { Article } from "@/lib/blog/types";
import { blogRequest } from "./api";
export function ArticleStatus({ article }: { article: Article }) {
  const live = Boolean(article.live && !article.deletedAt);
  return (
    <span className={`blog-status ${live ? "is-live" : ""}`}>
      <span />
      {article.deletedAt
        ? "Trash"
        : article.status === "scheduled"
          ? "Scheduled"
          : live
            ? "Live"
            : article.status === "archived"
              ? "Archived"
              : "Draft"}
    </span>
  );
}
export default function BlogDashboard({
  result,
  query,
}: {
  result: Awaited<ReturnType<typeof listAdminArticles>>;
  query: { q?: string; status?: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const clientKeys = useRef<Record<string, string>>({});
  async function create(id?: string) {
    if (busy) return;
    setBusy(id || "new");
    setError("");
    try {
      const data = await blogRequest<{ article: Article }>(
        id ? `/articles/${id}/duplicate` : "/articles",
        {
          method: "POST",
          body: JSON.stringify({
            clientKey: (clientKeys.current[id || "new"] ||=
              crypto.randomUUID()),
          }),
        },
      );
      router.push(`/admin/blog/${data.article.id}/edit`);
    } catch (e) {
      setError((e as Error).message);
      setBusy("");
    }
  }
  const link = (page: number) => {
    const p = new URLSearchParams();
    if (query.q) p.set("q", query.q);
    if (query.status) p.set("status", query.status);
    p.set("page", String(page));
    return "/admin/blog?" + p;
  };
  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Words for considered living</p>
          <h1 className="mt-3 font-display text-5xl font-normal">
            Your journal
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#66513e]">
            Shape a story, refine the details, and publish when it’s ready.
          </p>
        </div>
        <button
          onClick={() => create()}
          disabled={Boolean(busy)}
          className="site-button"
        >
          <Plus size={17} />
          {busy === "new" ? "Creating…" : "Create article"}
        </button>
      </header>
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["draft", "published", "scheduled", "archived"].map((status) => (
          <Link
            key={status}
            href={`/admin/blog?status=${status}`}
            className="blog-panel !p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-xs capitalize text-[#796650]">{status}</span>
            <span className="mt-2 block text-3xl font-medium">
              {result.counts.find((c) => c.status === status)?.count || 0}
            </span>
          </Link>
        ))}
      </div>
      {error ? (
        <p role="alert" className="blog-error mb-5">
          {error}
        </p>
      ) : null}
      <section className="blog-panel">
        <form className="mb-6 flex flex-wrap gap-3" action="/admin/blog">
          <label className="min-w-[180px] flex-1">
            <span className="sr-only">Search articles</span>
            <input
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="Search articles…"
              className="blog-input"
            />
          </label>
          <label>
            <span className="sr-only">Filter status</span>
            <select
              name="status"
              defaultValue={query.status || ""}
              className="blog-input"
            >
              <option value="">All articles</option>
              {["draft", "published", "scheduled", "archived", "deleted"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s === "deleted"
                      ? "Trash"
                      : s[0].toUpperCase() + s.slice(1)}
                  </option>
                ),
              )}
            </select>
          </label>
          <button className="blog-secondary">Apply filters</button>
          {query.q || query.status ? (
            <Link href="/admin/blog" className="blog-secondary">
              Clear
            </Link>
          ) : null}
        </form>
        {result.articles.length ? (
          <div className="overflow-x-auto">
            <table className="blog-table">
              <caption className="sr-only">Journal articles</caption>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Last edited</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link
                        href={`/admin/blog/${a.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {a.title || "Untitled article"}
                      </Link>
                      <p className="mt-1 max-w-[340px] truncate text-xs text-[#796650]">
                        /{a.slug}
                      </p>
                    </td>
                    <td>
                      <ArticleStatus article={a} />
                      {a.scheduledAt ? (
                        <p className="mt-2 text-xs text-[#796650]">
                          {new Date(a.scheduledAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}{" "}
                          IST
                        </p>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap text-xs text-[#796650]">
                      {new Date(a.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "Asia/Kolkata",
                      })}
                      <p className="mt-1">{a.lastEditedBy}</p>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/blog/${a.id}/edit`}
                          aria-label={`Edit ${a.title || "article"}`}
                          className="editor-tool"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => create(a.id)}
                          disabled={Boolean(busy)}
                          aria-label={`Duplicate ${a.title || "article"}`}
                          className="editor-tool"
                        >
                          <Copy size={16} />
                        </button>
                        {a.liveSlug ? (
                          <a
                            href={`/blog/${a.liveSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="View live article"
                            className="editor-tool"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto mb-5 text-[#b48b56]" size={34} />
            <h2 className="font-display text-3xl">
              {query.q || query.status
                ? "No articles match these filters."
                : "Every story starts somewhere."}
            </h2>
            <p className="mx-auto my-4 max-w-sm text-sm leading-7 text-[#796650]">
              Create your first article. It stays private until you choose to
              publish.
            </p>
          </div>
        )}
        {result.pages > 1 ? (
          <nav
            aria-label="Admin article pages"
            className="mt-6 flex items-center justify-between gap-4"
          >
            {result.page > 1 ? (
              <Link href={link(result.page - 1)} className="blog-secondary">
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-xs text-[#796650]">
              Page {result.page} of {result.pages}
            </span>
            {result.page < result.pages ? (
              <Link href={link(result.page + 1)} className="blog-secondary">
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
      <p className="mt-5 text-xs leading-6 text-[#796650]">
        Drafts, previews and archived articles are private. Editing a live story
        creates a working draft; republish to update the public version.
      </p>
    </>
  );
}
