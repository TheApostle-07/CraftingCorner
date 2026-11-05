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
    <form action={base} role="search" className="mb-6 flex flex-wrap gap-3">
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
        className="blog-input min-w-0 max-w-xl flex-1 font-normal"
      />
      <button className="site-button shrink-0" type="submit">
        Search
      </button>
      <span
        role="status"
        aria-live="polite"
        className="self-center text-xs text-[#796650]"
      >
        {pending ? "Searching…" : ""}
      </span>
    </form>
  );
}
