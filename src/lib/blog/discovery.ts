import { cache } from "react";
import { notFound } from "next/navigation";
import { blogTable } from "@/lib/blog/db";
import { blogSql, blogDatabaseConfigured, ensureBlogDatabase } from "./db";
import {
  getBlogTaxonomy,
  listPublicArticles,
  publishDueArticles,
} from "./service";
import type { ArticleFields } from "./types";
import { absoluteUrl, articleCanonical, pageMetadata } from "@/lib/seo";
import {
  firstSearchParam,
  searchPage,
  type SearchParam,
} from "@/lib/searchParams";

export type JournalSearchParams = { q?: SearchParam; page?: SearchParam };
type JournalFilter = "category" | "author" | "tag";

const readJournalPage = cache(
  (q: string, page: number, filter?: JournalFilter, value?: string) =>
    listPublicArticles({ q, page, ...(filter && { [filter]: value }) }),
);

export async function journalPage(
  query: JournalSearchParams,
  filter?: JournalFilter,
  value?: string,
) {
  const page = searchPage(query.page);
  const result = await readJournalPage(
    firstSearchParam(query.q).slice(0, 200),
    page,
    filter,
    value,
  );
  if (!result.unavailable && page > result.pages) notFound();
  return result;
}

export function journalMetadata(
  title: string,
  description: string,
  path: string,
  query: JournalSearchParams,
  data: Awaited<ReturnType<typeof journalPage>>,
  noIndex = false,
) {
  const searching = Boolean(firstSearchParam(query.q));
  const page = searching ? 1 : data.page;
  return pageMetadata(
    page > 1 ? `${title} – Page ${page}` : title,
    page > 1 ? `${description} Page ${page}.` : description,
    page > 1 ? `${path}?page=${page}` : path,
    undefined,
    noIndex || searching || data.total === 0,
  );
}

export async function publicJournalTaxonomy() {
  return blogDatabaseConfigured()
    ? getBlogTaxonomy()
    : { categories: [], authors: [] };
}

export async function indexableArticles() {
  if (!blogDatabaseConfigured()) return [];
  await ensureBlogDatabase();
  await publishDueArticles();
  const rows = await blogSql()<
    {
      slug: string;
      fields: ArticleFields & { liveUpdatedAt?: string };
      publishedAt: Date;
      coverUrl: string | null;
    }[]
  >`select a.live_slug as slug,a.live_snapshot as fields,a.published_at as "publishedAt",m.url as "coverUrl"
    from ${blogTable("blog_articles")} a
    left join ${blogTable("blog_media")} m on m.id=a.live_snapshot->>'coverImageId'
    where a.live_slug is not null and a.live_snapshot is not null and a.deleted_at is null
      and a.published_at<=now() and coalesce((a.live_snapshot->>'noIndex')::boolean,false)=false
    order by a.published_at desc,a.id limit 45000`;
  return rows.filter(
    (row) =>
      articleCanonical(row.slug, row.fields.canonicalUrl) ===
      absoluteUrl(`/blog/${row.slug}`),
  );
}
