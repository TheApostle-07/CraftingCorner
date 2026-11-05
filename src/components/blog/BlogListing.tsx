import Link from "next/link";
import ArticleCard from "./ArticleCard";
import BlogImage from "./BlogImage";
import JournalSearch from "./JournalSearch";
import { listPublicArticles, getBlogTaxonomy } from "@/lib/blog/service";
import { blogDatabaseConfigured } from "@/lib/blog/db";
export default async function BlogListing({
  title = "Journal & inspiration",
  description = "Thoughtful ideas for the way you live. Explore furniture, materials and spaces, one considered detail at a time.",
  query = {},
  base = "/blog",
}: {
  title?: string;
  description?: string;
  query?: {
    page?: number;
    q?: string;
    category?: string;
    tag?: string;
    author?: string;
  };
  base?: string;
}) {
  const result = await listPublicArticles(query);
  const options = blogDatabaseConfigured()
    ? await getBlogTaxonomy().catch(() => null)
    : null;
  const featured =
    !query.q &&
    !query.category &&
    !query.tag &&
    !query.author &&
    result.page === 1
      ? result.articles.find((a) => a.featured)
      : null;
  const articles = featured
    ? result.articles.filter((a) => a.id !== featured.id)
    : result.articles;
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  const pageHref = (page: number) => {
    const p = new URLSearchParams(params);
    if (page > 1) p.set("page", String(page));
    return `${base}${p.size ? "?" + p.toString() : ""}`;
  };
  return (
    <div className="site-container pb-20 pt-12 sm:pt-16">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow">The Crafting Corner journal</p>
        <h1 className="mt-4 break-words font-display text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.08]">
          {title}
        </h1>
        <p className="mt-5 text-base leading-8 text-[#746354]">{description}</p>
      </div>
      <JournalSearch base={base} query={query.q || ""} />
      <nav
        aria-label="Journal categories"
        className="mb-10 flex max-w-full flex-wrap gap-2"
      >
        <Link href="/blog" className="journal-filter">
          All stories
        </Link>
        {options?.categories.map((c) => (
          <Link
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            className={`journal-filter ${query.category === c.slug ? "bg-[#eee7dc]" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      {query.q ? (
        <p className="mb-8 text-sm text-[#746354]">
          {result.total} {result.total === 1 ? "story" : "stories"} matching “
          {query.q}”.{" "}
          <Link href={base} className="underline">
            Clear search
          </Link>
        </p>
      ) : null}
      {featured ? (
        <section className="mb-14 grid gap-8 rounded-2xl border border-[#ded3c5] p-5 sm:p-8 md:grid-cols-[1fr_0.9fr]">
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
          <div className="self-center">
            <p className="eyebrow">Featured story · {featured.category.name}</p>
            <h2 className="mt-4 font-display text-4xl font-normal leading-tight">
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
              : query.q
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
