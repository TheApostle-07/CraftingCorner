import Link from "next/link";
import ArticleCard from "./ArticleCard";
import BlogImage from "./BlogImage";
import JournalSearch from "./JournalSearch";
import {
  type journalPage,
  publicJournalCategories,
} from "@/lib/blog/discovery";
import { firstSearchParam, type SearchParam } from "@/lib/searchParams";
export default async function BlogListing({
  title = "The Crafting Corner Journal",
  description = "Practical guides to planning your rooms and choosing furniture, with photographs from our Mohali showroom.",
  query = {},
  result,
  base = "/blog",
}: {
  title?: string;
  description?: string;
  query?: {
    q?: SearchParam;
    category?: string;
    tag?: string;
    author?: string;
  };
  result: Awaited<ReturnType<typeof journalPage>>;
  base?: string;
}) {
  const q = firstSearchParam(query.q).slice(0, 200);
  const categories = await publicJournalCategories().catch(() => []);
  const featured =
    !q && !query.category && !query.tag && !query.author && result.page === 1
      ? result.articles.find((a) => a.featured)
      : null;
  const articles = featured
    ? result.articles.filter((a) => a.id !== featured.id)
    : result.articles;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  const pageHref = (page: number) => {
    const p = new URLSearchParams(params);
    if (page > 1) p.set("page", String(page));
    return `${base}${p.size ? "?" + p.toString() : ""}`;
  };
  return (
    <div className="site-container pb-20 pt-9 sm:pt-16">
      <div className="site-enter mx-auto mb-7 max-w-2xl text-center sm:mb-9">
        <h1 className="break-words text-balance font-display text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.08]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-7 text-[#746354] sm:text-base">
          {description}
        </p>
      </div>
      <JournalSearch base={base} query={q} />
      {categories.length > 0 ? (
        <nav
          aria-label="Journal categories"
          className="mb-7 flex max-w-full flex-wrap justify-center gap-2 sm:mb-10"
        >
          <Link
            href="/blog"
            aria-current={base === "/blog" ? "page" : undefined}
            className="journal-filter"
          >
            All stories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/category/${c.slug}`}
              aria-current={query.category === c.slug ? "page" : undefined}
              className="journal-filter"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      ) : null}
      {q ? (
        <p className="mb-8 break-words text-center text-sm text-[#746354]">
          {result.total} {result.total === 1 ? "story" : "stories"} matching “
          {q}”.{" "}
          <Link href={base} className="underline">
            Clear search
          </Link>
        </p>
      ) : null}
      {featured ? (
        <section
          data-reveal
          className="mb-14 grid gap-8 rounded-2xl border border-[#ded3c5] p-5 sm:p-8 md:grid-cols-2"
        >
          <Link href={`/blog/${featured.slug}`}>
            <BlogImage
              src={featured.cover?.url}
              alt={featured.coverAlt}
              width={featured.cover?.width}
              height={featured.cover?.height}
              priority
              className="aspect-[4/3] w-full rounded-xl bg-[#eee8df] object-contain"
            />
          </Link>
          <div className="min-w-0 self-center text-center md:text-start">
            <p className="eyebrow">Featured story · {featured.category.name}</p>
            <h2 className="mt-4 break-words text-balance font-display text-4xl font-normal leading-tight">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#746354]">
              {featured.excerpt}
            </p>
            <Link href={`/blog/${featured.slug}`} className="site-button mt-6">
              Read the story
            </Link>
          </div>
        </section>
      ) : null}
      {articles.length ? (
        <div className="product-grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : !featured ? (
        <section className="rounded-2xl border border-[#ded3c5] bg-white/40 px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-normal">
            {result.unavailable
              ? "The journal is taking a moment."
              : q
                ? "No matching stories yet."
                : "A little inspiration is on its way."}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#746354]">
            {result.unavailable
              ? "Please try again shortly. You can still explore our furniture collection."
              : "Our journal will bring together ideas for thoughtful rooms, furniture and everyday living. Explore the collection while we prepare our first stories."}
          </p>
          <Link href="/products" className="site-button mt-6">
            Explore the collection
          </Link>
        </section>
      ) : null}
      {result.pages > 1 ? (
        <nav
          aria-label="Article pages"
          className="mt-12 flex items-center justify-center gap-6 text-sm"
        >
          {result.page > 1 ? (
            <Link href={pageHref(result.page - 1)} className="journal-filter">
              Previous
            </Link>
          ) : null}
          <span>
            Page {result.page} of {result.pages}
          </span>
          {result.page < result.pages ? (
            <Link href={pageHref(result.page + 1)} className="journal-filter">
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
