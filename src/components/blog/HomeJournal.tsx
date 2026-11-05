import Link from "next/link";
import { listPublicArticles } from "@/lib/blog/service";
import ArticleCard from "./ArticleCard";
export default async function HomeJournal() {
  const result = await listPublicArticles({ limit: 3 });
  if (!result.articles.length) return null;
  return (
    <section className="site-container section-space">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">The art of living well</p>
          <h2 className="mt-4 font-display text-4xl font-normal sm:text-5xl">
            Journal &amp; inspiration
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#746354]">
            Considered ideas for thoughtful rooms, lasting materials and a home
            that feels your own.
          </p>
        </div>
        <Link href="/blog" className="journal-filter">
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
