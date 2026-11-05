"use client";
import Link from "next/link";
export default function JournalError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container py-20 text-center">
      <p className="eyebrow">The Crafting Corner journal</p>
      <h1 className="mt-4 font-display text-4xl font-normal">
        A moment, please.
      </h1>
      <p className="mx-auto my-6 max-w-lg text-sm leading-7 text-[#746354]">
        We couldn’t load this story just now. Please try again, or explore the
        collection while we reconnect.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="site-button" onClick={reset}>
          Try again
        </button>
        <Link href="/products" className="journal-filter">
          Explore the collection
        </Link>
      </div>
    </section>
  );
}
