import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Photo from "@/components/Photo";
import type { PublicArticle } from "@/lib/blog/types";
import { readingMinutes } from "@/lib/blog/content";
export default function ArticleCard({ article }: { article: PublicArticle }) {
  return (
    <article className="flex min-w-0 flex-col">
      <Link
        href={`/blog/${article.slug}`}
        aria-label={article.title}
        className="site-photo-link"
      >
        <Photo
          src={article.cover?.url || ""}
          alt={article.coverAlt}
          className="site-photo-zoom aspect-[4/3] rounded-xl"
          fit="contain"
          sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow">
          {article.category?.name || "Journal"} ·{" "}
          {readingMinutes(article.content)} min read
        </p>
        <h2 className="mt-3 break-words font-display text-[1.8rem] font-normal leading-tight">
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#746354]">
          {article.excerpt}
        </p>
        <Link
          href={`/blog/${article.slug}`}
          className="site-link mt-auto flex min-h-14 items-center justify-between gap-2 border-b border-[#ded3c5] pt-5 text-sm text-walnut"
        >
          Read the story{" "}
          <ArrowUpRight
            size={17}
            className="site-arrow shrink-0"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
