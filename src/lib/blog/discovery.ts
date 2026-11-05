import { blogTable } from "@/lib/blog/db";
import { blogSql, blogDatabaseConfigured, ensureBlogDatabase } from "./db";
import { publishDueArticles } from "./service";
import type { ArticleFields } from "./types";
export async function indexableArticles() {
  if (!blogDatabaseConfigured()) return [];
  await ensureBlogDatabase();
  await publishDueArticles();
  return blogSql()<
    {
      slug: string;
      fields: ArticleFields & { liveUpdatedAt?: string };
      publishedAt: Date;
    }[]
  >`select live_slug as slug,live_snapshot as fields,published_at as "publishedAt" from ${blogTable("blog_articles")} where live_snapshot is not null and deleted_at is null and published_at<=now() and coalesce((live_snapshot->>'noIndex')::boolean,false)=false order by published_at desc,id limit 45000`;
}
