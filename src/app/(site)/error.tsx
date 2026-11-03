'use client';
import Link from 'next/link';
export default function SiteError({ reset }: { reset: () => void }) {
  return (
    <section className="site-container py-24 text-center">
      <p className="eyebrow">Crafting Corner</p>
      <h1 className="mt-5 font-display text-4xl font-normal">
        Let’s try that again.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#746354]">
        We couldn’t load this page just now. Please retry, or contact our team
        for help finding a piece.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="site-button">
          Try again
        </button>
        <Link href="/contact" className="site-button">
          Contact our team
        </Link>
      </div>
    </section>
  );
}
