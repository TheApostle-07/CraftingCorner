"use client";
import { useState } from "react";
import type { BlogAuthor, BlogCategory, BlogOptions } from "@/lib/blog/types";
import { blogSlug } from "@/lib/blog/content";
import { blogRequest } from "./api";
import Dialog from "./Dialog";
export default function TaxonomyManager({ initial }: { initial: BlogOptions }) {
  const [originalSlug, setOriginalSlug] = useState("");
  const [options, setOptions] = useState(initial),
    [category, setCategory] = useState<BlogCategory | null>(null),
    [author, setAuthor] = useState<BlogAuthor | null>(null),
    [remove, setRemove] = useState<{
      kind: "authors" | "categories";
      id: string;
      name: string;
    } | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function action(path: string, method: string, body?: unknown) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await blogRequest(path, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      setOptions(await blogRequest<BlogOptions>("/options"));
      setCategory(null);
      setAuthor(null);
      setRemove(null);
      setMessage("Changes saved.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <p className="eyebrow">People & perspectives</p>
      <h1 className="my-4 font-display text-5xl font-normal">
        Categories & authors
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-[#66513e]">
        Give each story a clear home and an honest byline. Use the Crafting
        Corner team byline or add a real contributor with their permission.
      </p>
      {error ? (
        <p role="alert" className="blog-error mb-5">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="blog-notice mb-5">
          {message}
        </p>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="blog-panel">
          <header className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl">Categories</h2>
            <button
              className="blog-secondary"
              onClick={() => {
                setOriginalSlug("");
                setCategory({ slug: "", name: "", description: "" });
              }}
            >
              Add category
            </button>
          </header>
          <ul className="divide-y divide-[#e8dccb]">
            {options.categories.map((c) => (
              <li key={c.slug} className="py-5">
                <h3 className="text-sm font-medium">{c.name}</h3>
                <p className="my-2 text-xs leading-6 text-[#796650]">
                  {c.description}
                </p>
                <div className="flex gap-2">
                  <button
                    className="blog-secondary"
                    onClick={() => {
                      setOriginalSlug(c.slug);
                      setCategory(c);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="blog-secondary !text-[#9c3434]"
                    onClick={() =>
                      setRemove({
                        kind: "categories",
                        id: c.slug,
                        name: c.name,
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="blog-panel">
          <header className="mb-6 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl">Authors</h2>
            <button
              className="blog-secondary"
              onClick={() =>
                setAuthor({
                  id: "",
                  slug: "",
                  name: "",
                  bio: "",
                  isOrganization: false,
                })
              }
            >
              Add author
            </button>
          </header>
          <ul className="divide-y divide-[#e8dccb]">
            {options.authors.map((a) => (
              <li key={a.id} className="py-5">
                <h3 className="text-sm font-medium">{a.name}</h3>
                <p className="my-2 text-xs leading-6 text-[#796650]">
                  {a.bio || "No biography added."}
                </p>
                <div className="flex gap-2">
                  <button
                    className="blog-secondary"
                    onClick={() => setAuthor(a)}
                  >
                    Edit
                  </button>
                  <button
                    className="blog-secondary !text-[#9c3434]"
                    onClick={() =>
                      setRemove({ kind: "authors", id: a.id, name: a.name })
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {category ? (
        <Dialog
          title={category.slug ? "Edit category" : "New category"}
          onClose={() => !busy && setCategory(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void action("/categories", "POST", {
                ...category,
                originalSlug: originalSlug || undefined,
              });
            }}
            className="space-y-5"
          >
            <label className="blog-label">
              Name
              <input
                className="blog-input"
                required
                maxLength={100}
                value={category.name}
                onChange={(e) =>
                  setCategory({
                    ...category,
                    name: e.target.value,
                    slug: Boolean(originalSlug)
                      ? category.slug
                      : blogSlug(e.target.value),
                  })
                }
              />
            </label>
            <label className="blog-label">
              Slug
              <input
                className="blog-input"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                readOnly={Boolean(originalSlug)}
                value={category.slug}
                onChange={(e) =>
                  setCategory({ ...category, slug: e.target.value })
                }
              />
              <span className="text-xs font-normal text-[#796650]">
                Existing category URLs stay fixed to preserve links.
              </span>
            </label>
            <label className="blog-label">
              Description
              <textarea
                className="blog-input"
                maxLength={600}
                value={category.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
              />
            </label>
            <button disabled={busy} className="site-button">
              Save category
            </button>
            {error ? (
              <p role="alert" className="blog-error">
                {error}
              </p>
            ) : null}
          </form>
        </Dialog>
      ) : null}
      {author ? (
        <Dialog
          title={author.id ? "Edit author" : "New author"}
          onClose={() => !busy && setAuthor(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void action("/authors", "POST", {
                ...author,
                id: author.id || undefined,
              });
            }}
            className="space-y-5"
          >
            <label className="blog-label">
              Display name
              <input
                className="blog-input"
                required
                maxLength={150}
                value={author.name}
                onChange={(e) =>
                  setAuthor({
                    ...author,
                    name: e.target.value,
                    slug: author.id ? author.slug : blogSlug(e.target.value),
                  })
                }
              />
            </label>
            <label className="blog-label">
              Slug
              <input
                className="blog-input"
                required
                readOnly={Boolean(author.id)}
                value={author.slug}
                onChange={(e) => setAuthor({ ...author, slug: e.target.value })}
              />
            </label>
            <label className="blog-label">
              Biography
              <textarea
                className="blog-input"
                maxLength={1500}
                rows={4}
                value={author.bio}
                onChange={(e) => setAuthor({ ...author, bio: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={author.isOrganization}
                onChange={(e) =>
                  setAuthor({ ...author, isOrganization: e.target.checked })
                }
              />
              Organisation / team byline
            </label>
            <button disabled={busy} className="site-button">
              Save author
            </button>
            {error ? (
              <p role="alert" className="blog-error">
                {error}
              </p>
            ) : null}
          </form>
        </Dialog>
      ) : null}
      {remove ? (
        <Dialog
          title={`Delete ${remove.name}?`}
          onClose={() => !busy && setRemove(null)}
        >
          <p className="text-sm leading-7 text-[#66513e]">
            You can only delete an entry that is not referenced by any article,
            including drafts and scheduled stories.
          </p>
          <button
            disabled={busy}
            className="site-button mt-5"
            onClick={() =>
              action(
                `/${remove.kind}/${encodeURIComponent(remove.id)}`,
                "DELETE",
              )
            }
          >
            Delete entry
          </button>
          {error ? (
            <p role="alert" className="blog-error mt-4">
              {error}
            </p>
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
}
