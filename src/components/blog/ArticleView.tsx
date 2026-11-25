import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ArticleBody from "./ArticleBody";
import ArticleCard from "./ArticleCard";
import BlogImage from "./BlogImage";
import type { PublicArticle } from "@/lib/blog/types";
import { articleHeadings, blogSlug, readingMinutes } from "@/lib/blog/content";
import { absoluteUrl, articleCanonical, breadcrumbs, jsonLd } from "@/lib/seo";
import type { Product, SiteData } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

const date = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
export default function ArticleView({
  article,
  related = [],
  products = [],
  site,
  preview = false,
}: {
  article: PublicArticle;
  related?: PublicArticle[];
  products?: Product[];
  site?: SiteData;
  preview?: boolean;
}) {
  const headings = articleHeadings(article.content);
  const canonical = articleCanonical(article.slug, article.canonicalUrl);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: article.cover ? absoluteUrl(article.cover.url) : undefined,
    author: {
      "@type": article.author.isOrganization ? "Organization" : "Person",
      name: article.author.name,
      url: absoluteUrl(`/blog/author/${article.author.slug}`),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
      "@type": "Organization",
      name: "Crafting Corner",
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: canonical,
  };
  const phone = site?.whatsapp.number.replace(/\D/g, "") || "";
  return (
    <article className="pb-20">
      {!preview ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd(
                breadcrumbs([
                  { name: "Home", path: "/" },
                  { name: "Journal", path: "/blog" },
                  { name: article.title, path: `/blog/${article.slug}` },
                ]),
              ),
            }}
          />
        </>
      ) : null}
      <header className="site-container pb-8 pt-9 text-center sm:pb-10 sm:pt-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap justify-center gap-2 text-xs text-[#796650]"
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Journal</Link>
          <span>/</span>
          <span aria-current="page" className="max-w-[240px] truncate">
            {article.title}
          </span>
        </nav>
        <Link
          href={`/blog/category/${article.category.slug}`}
          className="eyebrow"
        >
          {article.category.name}
        </Link>
        <h1 className="mx-auto mt-4 max-w-[800px] break-words text-balance font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-normal leading-[1.08] text-[#38291f]">
          {article.title || "Untitled article"}
        </h1>
        {article.subtitle ? (
          <p className="mx-auto mt-4 max-w-[640px] text-pretty text-base leading-7 text-[#746354]">
            {article.subtitle}
          </p>
        ) : null}
        <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs leading-6 text-[#796650]">
          <Link href={`/blog/author/${article.author.slug}`}>
            {article.author.name}
          </Link>
          <time dateTime={article.publishedAt}>
            {date(article.publishedAt)}
          </time>
          <span>{readingMinutes(article.content)} min read</span>
          {date(article.updatedAt) !== date(article.publishedAt) ? (
            <span>Updated {date(article.updatedAt)}</span>
          ) : null}
        </div>
      </header>
      {article.cover ? (
        <figure className="site-container mb-9 sm:mb-12">
          <BlogImage
            src={article.cover.url}
            alt={article.coverAlt}
            width={article.cover.width}
            height={article.cover.height}
            priority
            sizes="(max-width:639px) calc(100vw - 40px), 520px"
            className="mx-auto h-auto w-auto max-w-full rounded-2xl object-contain sm:max-h-[68vh] sm:max-w-[520px]"
          />
          {article.cover.caption ? (
            <figcaption className="mx-auto mt-3 max-w-[740px] text-center text-xs leading-6 text-[#796650]">
              {article.cover.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      <div className="site-container">
        <div className="mx-auto w-full min-w-0 max-w-[680px] break-words">
          {headings.length > 2 ? (
            <details className="mb-8 rounded-xl border border-[#ded3c5] px-4 sm:px-5">
              <summary className="min-h-11 cursor-pointer py-3 text-sm text-walnut">
                In this article
              </summary>
              <nav
                className="grid gap-x-6 pb-4 text-sm leading-6 text-[#746354] sm:grid-cols-2"
                aria-label="Table of contents"
              >
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`flex min-h-11 items-center py-1 underline-offset-4 hover:underline ${h.level > 2 ? "pl-3" : ""}`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </details>
          ) : null}
          <ArticleBody document={article.content} />
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${blogSlug(tag)}`}
                className="rounded-full border border-[#ded3c5] px-4 py-2 text-xs text-walnut"
              >
                {tag}
              </Link>
            ))}
          </div>
          {article.author.bio ? (
            <div className="mt-10 border-t border-[#ded3c5] pt-7">
              <p className="font-display text-2xl">{article.author.name}</p>
              <p className="mt-3 text-sm leading-7 text-[#746354]">
                {article.author.bio}
              </p>
            </div>
          ) : null}
          <div className="my-10 rounded-2xl bg-[#eee7dc] p-6 text-center sm:p-8">
            <h2 className="text-balance font-display text-3xl font-normal">
              Visit the showroom or talk to our team
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#746354]">
              Explore our collection or speak with our team about your room,
              proportions and preferred finishes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/products" className="site-button">
                Explore the collection <ArrowUpRight size={16} />
              </Link>
              <a
                href={
                  site?.whatsapp.enabled && /^[1-9]\d{9,14}$/.test(phone)
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hi Crafting Corner, I read "${article.title}" and would like to discuss furniture for my space.`)}`
                    : "/contact"
                }
                className="inline-flex min-h-12 items-center text-sm text-walnut underline underline-offset-4"
              >
                Discuss your space
              </a>
            </div>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-walnut"
          >
            <ArrowLeft size={16} />
            Back to the journal
          </Link>
        </div>
      </div>
      {products.length ? (
        <section className="site-container section-space">
          <h2 className="mb-8 text-center font-display text-4xl font-normal">
            From the collection
          </h2>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </section>
      ) : null}
      {related.length ? (
        <section className="site-container section-space">
          <h2 className="mb-8 text-center font-display text-4xl font-normal">
            More from the Journal
          </h2>
          <div className="product-grid">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
