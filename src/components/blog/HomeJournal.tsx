import Link from "next/link";
import { listPublicArticles } from "@/lib/blog/service";
import ArticleCard from "./ArticleCard";
export default async function HomeJournal() {
  const result = await listPublicArticles({ limit: 3 });
  if (!result.articles.length) return null;
  return (
    <section className="site-container section-space">
      <div
        data-reveal
        className="mb-9 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-start"
      >
        <div>
          <p className="eyebrow">The art of living well</p>
          <h2 className="mt-3 text-balance font-display text-4xl font-normal sm:text-5xl">
            Journal &amp; inspiration
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-7 text-[#746354] md:mx-0">
            Considered ideas for thoughtful rooms, lasting materials and a home
            that feels your own.
          </p>
        </div>
        <Link href="/blog" className="journal-filter shrink-0">
          Explore the journal
        </Link>
      </div>
      <div className="product-grid">
        {result.articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
