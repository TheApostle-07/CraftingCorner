"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
export default function JournalSearch({
  base,
  query = "",
}: {
  base: string;
  query?: string;
}) {
  const router = useRouter(),
    [value, setValue] = useState(query),
    [pending, startTransition] = useTransition();
  const initial = useRef(query);
  useEffect(() => {
    if (value === initial.current) return;
    const timer = setTimeout(() => {
      initial.current = value;
      const params = new URLSearchParams();
      if (value.trim()) params.set("q", value.trim());
      startTransition(() =>
        router.replace(`${base}${params.size ? "?" + params : ""}`, {
          scroll: false,
        }),
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [value, base, router]);
  useEffect(() => {
    initial.current = query;
    setValue(query);
  }, [query]);
  return (
    <form
      action={base}
      role="search"
      className="mx-auto mb-6 grid max-w-xl grid-cols-[minmax(0,1fr)_auto] gap-3"
    >
      <label className="sr-only" htmlFor="journal-search">
        Search journal
      </label>
      <input
        id="journal-search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        maxLength={200}
        placeholder="Search stories, materials or ideas"
        className="blog-input min-w-0 font-normal"
      />
      <button className="site-button px-4 sm:px-6" type="submit">
        Search
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {pending ? "Searching…" : ""}
      </span>
    </form>
  );
}
