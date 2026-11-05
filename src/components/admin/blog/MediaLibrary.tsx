"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, Search, LoaderCircle } from "lucide-react";
import type { BlogMedia, BlogOptions } from "@/lib/blog/types";
import { blogRequest } from "./api";
import Dialog from "./Dialog";

export async function uploadMediaFile(file: File, alt = "", caption = "") {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", alt);
  form.append("caption", caption);
  return (
    await blogRequest<{ media: BlogMedia }>("/media", {
      method: "POST",
      body: form,
    })
  ).media;
}
export default function MediaLibrary({
  onSelect,
  initialOptions,
}: {
  onSelect?: (media: BlogMedia) => void;
  initialOptions?: BlogOptions;
}) {
  const [options, setOptions] = useState(initialOptions);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{
    media: BlogMedia[];
    page: number;
    pages: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<BlogMedia | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function refresh() {
    const data = await blogRequest<BlogOptions>("/options");
    setOptions(data);
    setResult(
      await blogRequest(`/media?q=${encodeURIComponent(query)}&page=${page}`),
    );
  }
  useEffect(() => {
    if (initialOptions) return;
    const controller = new AbortController();
    blogRequest<BlogOptions>("/options", { signal: controller.signal })
      .then(setOptions)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [initialOptions]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      blogRequest<{
        media: BlogMedia[];
        page: number;
        pages: number;
        total: number;
      }>(`/media?q=${encodeURIComponent(query)}&page=${page}`, {
        signal: controller.signal,
      })
        .then(setResult)
        .catch((e) => {
          if (e.name !== "AbortError") setError(e.message);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, page]);
  const media = result?.media || [];
  async function upload(file: File) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const image = await uploadMediaFile(file);
      await refresh();
      setEditing(image);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }
  async function saveMedia() {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await blogRequest(`/media/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ alt: editing.alt, caption: editing.caption }),
      });
      await refresh();
      if (onSelect && editing.alt.trim()) onSelect(editing);
      setEditing(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="space-y-5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) void upload(e.dataTransfer.files[0]);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search media</span>
          <Search
            size={17}
            className="absolute left-3 top-3.5 text-[#796650]"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search photographs or filenames"
            className="blog-input pl-10"
          />
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.[0]) void upload(e.target.files[0]);
          }}
        />
        <button
          type="button"
          className="site-button"
          disabled={busy || !options?.uploadsConfigured}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Upload size={17} />
          )}
          Upload photo
        </button>
      </div>
      <p className="text-xs leading-6 text-[#796650]">
        Reuse a library image or drop a JPEG, PNG, WebP or AVIF up to 4 MB.
        Product photographs keep their proportions.
      </p>
      {options && !options.uploadsConfigured ? (
        <p role="status" className="blog-notice">
          Cloudinary upload credentials need configuring. The existing
          real-photo library is ready to use.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="blog-error">
          {error}
        </p>
      ) : null}
      {!options && !error ? (
        <p role="status" className="text-sm">
          Loading photographs…
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setEditing(image)}
            className="overflow-hidden rounded-xl border border-[#ded3c5] bg-white text-left transition hover:border-[#8c6c4d]"
          >
            <img
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="aspect-[4/3] w-full bg-[#eee7dc] object-contain"
            />
            <span className="block truncate px-3 pt-3 text-xs font-medium">
              {image.filename}
            </span>
            <span className="block px-3 pb-3 pt-1 text-[11px] text-[#796650]">
              {image.width} × {image.height} · {image.uses || 0} references
            </span>
          </button>
        ))}
      </div>
      {result && !media.length ? (
        <p className="py-10 text-center text-sm text-[#796650]">
          No photographs match this search.
        </p>
      ) : null}
      {result && result.pages > 1 ? (
        <nav
          className="flex items-center justify-between gap-3"
          aria-label="Photograph pages"
        >
          <button
            className="blog-secondary"
            disabled={result.page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-xs text-[#796650]">
            {result.page} / {result.pages} · {result.total} images
          </span>
          <button
            className="blog-secondary"
            disabled={result.page >= result.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </nav>
      ) : null}
      {editing ? (
        <Dialog
          title="Photograph details"
          onClose={() => {
            if (!busy) setEditing(null);
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <img
              src={editing.url}
              alt={editing.alt}
              width={editing.width}
              height={editing.height}
              className="max-h-[420px] w-full rounded-xl bg-[#eee7dc] object-contain"
            />
            <div className="space-y-5">
              <p className="break-all text-sm">{editing.filename}</p>
              <label className="blog-label">
                Alt text
                <textarea
                  value={editing.alt}
                  onChange={(e) =>
                    setEditing({ ...editing, alt: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  className="blog-input"
                />
                <span className="text-xs font-normal text-[#796650]">
                  Describe what is visible. Avoid repeating keywords.
                </span>
              </label>
              <label className="blog-label">
                Caption
                <textarea
                  value={editing.caption}
                  onChange={(e) =>
                    setEditing({ ...editing, caption: e.target.value })
                  }
                  rows={3}
                  maxLength={1000}
                  className="blog-input"
                />
              </label>
              <button
                type="button"
                onClick={() => void saveMedia()}
                disabled={busy || Boolean(onSelect && !editing.alt.trim())}
                className="site-button w-full"
              >
                {busy
                  ? "Saving…"
                  : onSelect
                    ? "Save & use photograph"
                    : "Save details"}
              </button>
              {editing.provider !== "bundled" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmDelete(true)}
                  className="min-h-11 text-sm text-red-800 underline underline-offset-4"
                >
                  Delete unused image
                </button>
              ) : (
                <p className="text-xs leading-6 text-[#796650]">
                  Original catalogue photography is protected from deletion.
                </p>
              )}
              {error ? (
                <p role="alert" className="blog-error">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </Dialog>
      ) : null}
      {confirmDelete && editing ? (
        <Dialog
          title="Delete photograph?"
          onClose={() => setConfirmDelete(false)}
        >
          <p className="text-sm leading-7">
            This removes the uploaded file. Images referenced by an active draft
            or published article cannot be deleted.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className="site-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await blogRequest(`/media/${editing.id}`, {
                    method: "DELETE",
                  });
                  setConfirmDelete(false);
                  setEditing(null);
                  await refresh();
                } catch (e) {
                  setError((e as Error).message);
                  setConfirmDelete(false);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Delete photograph
            </button>
            <button
              className="blog-secondary"
              onClick={() => setConfirmDelete(false)}
            >
              Keep image
            </button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
