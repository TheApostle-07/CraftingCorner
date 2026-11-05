"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="blog-panel mx-auto my-12 max-w-xl">
      <p className="eyebrow">Journal studio</p>
      <h1 className="mt-3 font-display text-4xl">
        We couldn’t open this page.
      </h1>
      <p className="my-5 text-sm leading-7 text-[#66513e]">
        Your saved work is still in place. Check the connection and try again.
        If this continues, ask your administrator to check the blog database
        configuration.
      </p>
      <button className="site-button" onClick={reset}>
        Try again
      </button>
      <Link href="/admin" className="blog-secondary ml-3">
        Back to admin
      </Link>
    </section>
  );
}
