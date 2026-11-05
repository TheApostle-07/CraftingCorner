import { blogTable, blogJSON } from "@/lib/blog/db";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import { blogSql, ensureBlogDatabase, blogDatabaseConfigured } from "./db";
import { BlogError, parseArticleFields, publishingIssues } from "./validation";
import {
  CONTENT_SCHEMA_VERSION,
  emptyDocument,
  textContent,
  blogSlug,
} from "./content";
import type {
  Article,
  ArticleFields,
  BlogAuthor,
  BlogCategory,
  BlogMedia,
  BlogOptions,
  PublicArticle,
  RichNode,
} from "./types";

type Row = {
  id: string;
  title: string;
  slug: string;
  fields: ArticleFields;
  category_slug: string;
  author_id: string;
  cover_image_id: string;
  status: Article["status"];
  revision: number;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  scheduled_at: Date | null;
  deleted_at: Date | null;
  last_edited_by: string;
  live_snapshot: ArticleFields | null;
  live_slug: string | null;
  last_mutation_id?: string;
};
const iso = (v: Date | string | null) => (v ? new Date(v).toISOString() : null);
export function articleFromRow(row: Row): Article {
  return {
    ...row.fields,
    id: row.id,
    status: row.status,
    revision: row.revision,
    createdAt: iso(row.created_at)!,
    updatedAt: iso(row.updated_at)!,
    publishedAt: iso(row.published_at),
    scheduledAt: iso(row.scheduled_at),
    deletedAt: iso(row.deleted_at),
    lastEditedBy: row.last_edited_by,
    live: row.live_snapshot,
    liveSlug: row.live_slug,
  };
}
export const getBlogTaxonomy = cache(async () => {
  await ensureBlogDatabase();
  const sql = blogSql();
  const [categories, authors] = await Promise.all([
    sql<
      BlogCategory[]
    >`select slug,name,description from ${blogTable("blog_categories")} order by name`,
    sql<
      BlogAuthor[]
    >`select id,slug,name,bio,is_organization as "isOrganization" from ${blogTable("blog_authors")} order by name`,
  ]);
  return { categories, authors };
});
export async function listBlogMedia(query: { q?: string; page?: number } = {}) {
  await ensureBlogDatabase();
  const sql = blogSql(),
    term = `%${(query.q || "").slice(0, 200)}%`;
  const [count] =
    await sql`select count(*)::integer as total from ${blogTable("blog_media")} where filename ilike ${term} or alt ilike ${term} or caption ilike ${term}`;
  const pages = Math.max(1, Math.ceil(count.total / 24)),
    page = Math.max(1, Math.min(pages, Math.floor(Number(query.page)) || 1));
  const media = await sql<
    BlogMedia[]
  >`select m.id,m.url,m.filename,m.alt,m.caption,m.width,m.height,m.provider,m.public_id as "publicId",m.created_at as "createdAt",count(r.article_id)::integer as uses from ${blogTable("blog_media")} m left join ${blogTable("blog_media_references")} r on r.media_id=m.id where m.filename ilike ${term} or m.alt ilike ${term} or m.caption ilike ${term} group by m.id order by m.created_at desc,m.id limit 24 offset ${(page - 1) * 24}`;
  return { media, page, pages, total: count.total };
}
export const getBlogOptions = cache(async (): Promise<BlogOptions> => {
  await ensureBlogDatabase();
  const sql = blogSql();
  const [categories, authors, media] = await Promise.all([
    sql<
      BlogCategory[]
    >`select slug,name,description from ${blogTable("blog_categories")} order by name`,
    sql<
      BlogAuthor[]
    >`select id,slug,name,bio,is_organization as "isOrganization" from ${blogTable("blog_authors")} order by name`,
    sql<
      BlogMedia[]
    >`select m.id,m.url,m.filename,m.alt,m.caption,m.width,m.height,m.provider,m.public_id as "publicId",m.created_at as "createdAt",count(r.article_id)::integer as uses from ${blogTable("blog_media")} m left join ${blogTable("blog_media_references")} r on r.media_id=m.id group by m.id order by m.created_at desc limit 100`,
  ]);
  return {
    categories,
    authors,
    media,
    uploadsConfigured:
      Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET,
      ) ||
      (process.env.NODE_ENV !== "production" &&
        process.env.BLOG_LOCAL_UPLOADS === "true"),
  };
});
export async function getEditorOptions(article: Article): Promise<BlogOptions> {
  const options = await getBlogOptions();
  const ids = [article.coverImageId, article.ogImageId].filter(
    (id) => id && !options.media.some((m) => m.id === id),
  );
  if (!ids.length) return options;
  const sql = blogSql();
  const media = await sql<
    BlogMedia[]
  >`select id,url,filename,alt,caption,width,height,provider from ${blogTable("blog_media")} where id in ${sql(ids)}`;
  return { ...options, media: [...options.media, ...media] };
}
export async function getAdminArticle(id: string) {
  if (!/^[\da-f-]{36}$/i.test(id))
    throw new BlogError("Article not found.", 404);
  await ensureBlogDatabase();
  const sql = blogSql();
  const [row] = await sql<
    Row[]
  >`select * from ${blogTable("blog_articles")} where id=${id}`;
  if (!row) throw new BlogError("Article not found.", 404);
  return articleFromRow(row);
}
export async function listAdminArticles(
  query: { page?: number; q?: string; status?: string } = {},
) {
  await ensureBlogDatabase();
  await publishDueArticles();
  const sql = blogSql();
  const page = Math.max(1, Math.floor(Number(query.page)) || 1),
    term = `%${(query.q || "").slice(0, 200)}%`,
    status = query.status || "";
  const condition = sql`(${status === "deleted"} and deleted_at is not null or ${status !== "deleted"} and deleted_at is null) and (${status === "" || status === "deleted"} or status=${status}) and (title ilike ${term} or slug ilike ${term})`;
  const [count] =
    await sql`select count(*)::integer as total from ${blogTable("blog_articles")} where ${condition}`;
  const rows = await sql<
    Row[]
  >`select * from ${blogTable("blog_articles")} where ${condition} order by updated_at desc,id limit 15 offset ${(Math.min(page, Math.max(1, Math.ceil(count.total / 15))) - 1) * 15}`;
  const counts =
    await sql`select status,count(*)::integer as count from ${blogTable("blog_articles")} where deleted_at is null group by status`;
  return {
    articles: rows.map(articleFromRow),
    total: count.total,
    page: Math.min(page, Math.max(1, Math.ceil(count.total / 15))),
    pages: Math.max(1, Math.ceil(count.total / 15)),
    counts,
  };
}
export function newArticleFields(title = ""): ArticleFields {
  return {
    title,
    slug: blogSlug(title) || `untitled-${randomUUID().slice(0, 8)}`,
    subtitle: "",
    excerpt: "",
    content: emptyDocument(),
    contentSchemaVersion: CONTENT_SCHEMA_VERSION,
    categorySlug: "",
    authorId: "crafting-corner",
    coverImageId: null,
    coverAlt: "",
    featured: false,
    tags: [],
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImageId: null,
    focusKeyword: "",
    relatedProductSlugs: [],
    noIndex: false,
  };
}
export async function createArticle(
  actor: string,
  clientKey: string,
  initial?: ArticleFields,
) {
  await ensureBlogDatabase();
  const sql = blogSql();
  const fields = parseArticleFields(initial || newArticleFields());
  const id = randomUUID();
  return sql.begin(async (transaction) => {
    const tx = transaction as unknown as typeof sql;
    await tx`select pg_advisory_xact_lock(853019211)`;
    const [existing] = await tx<
      Row[]
    >`select * from ${blogTable("blog_articles")} where client_key=${clientKey}`;
    if (existing) return articleFromRow(existing);
    const reserved =
      await tx`select id from ${blogTable("blog_articles")} where slug=${fields.slug} or live_slug=${fields.slug} or scheduled_snapshot->>'slug'=${fields.slug} union all select article_id as id from ${blogTable("blog_redirects")} where slug=${fields.slug}`;
    if (reserved.length)
      throw new BlogError(
        "That article slug already exists. Choose a different URL.",
        409,
      );
    const rows = await tx<
      Row[]
    >`insert into ${blogTable("blog_articles")}(id,client_key,title,slug,fields,category_slug,author_id,last_edited_by)
    values (${id},${clientKey},${fields.title},${fields.slug},${tx.json(blogJSON(fields))}::jsonb,${fields.categorySlug || null},${fields.authorId || null},${actor})
    on conflict(client_key) do update set client_key=excluded.client_key returning *`;
    const refs = await checkReferences(tx, fields, false);
    for (const mediaId of refs)
      await tx`insert into ${blogTable("blog_media_references")}(article_id,media_id) values(${id},${mediaId}) on conflict do nothing`;
    return articleFromRow(rows[0]);
  });
}
type Action =
  | "save"
  | "publish"
  | "schedule"
  | "unpublish"
  | "archive"
  | "restore"
  | "delete"
  | "restore-revision";
async function checkReferences(
  sql: ReturnType<typeof blogSql>,
  fields: ArticleFields,
  publishing: boolean,
) {
  const media = await sql<
    { id: string; url: string }[]
  >`select id,url from ${blogTable("blog_media")}`;
  const references = new Set<string>();
  for (const id of [fields.coverImageId, fields.ogImageId])
    if (id) {
      if (!media.some((m) => m.id === id))
        throw new BlogError("The selected image no longer exists.");
      references.add(id);
    }
  const visit = (node: RichNode) => {
    if (node.type === "image") {
      const image = media.find((m) => m.url === node.attrs?.src);
      if (!image)
        throw new BlogError(
          "Import inline images into the media library before saving.",
        );
      references.add(image.id);
    }
    node.content?.forEach(visit);
  };
  visit(fields.content);
  if (publishing && publishingIssues(fields).length)
    throw new BlogError(publishingIssues(fields).join(" "), 422);
  if (fields.relatedProductSlugs.length) {
    const { loadAllProducts } = await import("@/lib/loaders.server");
    const products = await loadAllProducts();
    if (
      fields.relatedProductSlugs.some(
        (slug) => !products.some((p) => p.slug === slug),
      )
    )
      throw new BlogError(
        "A related product is no longer public. Choose another product.",
      );
  }
  return references;
}
export async function mutateArticle(
  id: string,
  actor: string,
  input: {
    action: Action;
    revision: number;
    mutationId: string;
    fields?: unknown;
    scheduledAt?: string;
    restoreRevision?: number;
  },
) {
  await ensureBlogDatabase();
  const sql = blogSql();
  try {
    return await sql.begin(async (transaction) => {
      const tx = transaction as unknown as typeof sql;
      // One namespace lock covers working, live, scheduled and historical URLs.
      await tx`select pg_advisory_xact_lock(853019211)`;
      const [row] = await tx<
        Row[]
      >`select * from ${blogTable("blog_articles")} where id=${id} for update`;
      if (!row) throw new BlogError("Article not found.", 404);
      if (row.last_mutation_id === input.mutationId) return articleFromRow(row);
      if (row.revision !== input.revision)
        throw new BlogError(
          "A newer revision exists. Your text is preserved. Reload the latest version or download your draft before continuing.",
          409,
        );
      let fields = input.fields ? parseArticleFields(input.fields) : row.fields;
      if (input.action === "restore-revision") {
        const [revision] =
          await tx`select snapshot from ${blogTable("blog_revisions")} where article_id=${id} and revision=${input.restoreRevision || 0}`;
        if (!revision) throw new BlogError("Revision not found.", 404);
        fields = parseArticleFields(revision.snapshot.fields);
      }
      const publishing =
        input.action === "publish" || input.action === "schedule";
      const refs = await checkReferences(tx, fields, publishing);
      const alias =
        await tx`select article_id from ${blogTable("blog_redirects")} where slug=${fields.slug}`;
      if (alias.some((a) => a.article_id !== id))
        throw new BlogError(
          "That URL is reserved by another article. Choose a different slug.",
          409,
        );
      const occupied =
        await tx`select id from ${blogTable("blog_articles")} where (slug=${fields.slug} or live_slug=${fields.slug} or scheduled_snapshot->>'slug'=${fields.slug}) and id<>${id}`;
      if (occupied.length)
        throw new BlogError(
          "That article slug already exists. Choose a different URL.",
          409,
        );
      if (row.deleted_at && !["restore", "delete"].includes(input.action))
        throw new BlogError(
          "Restore this article from Trash before editing.",
          409,
        );
      let status = row.status,
        live = row.live_snapshot,
        liveSlug = row.live_slug;
      let publishedAt = iso(row.published_at),
        scheduledAt = iso(row.scheduled_at),
        deletedAt = iso(row.deleted_at);
      let scheduledSnapshot: unknown = null;
      if (input.action === "save") {
        const [stored] =
          await tx`select scheduled_snapshot from ${blogTable("blog_articles")} where id=${id}`;
        scheduledSnapshot = stored.scheduled_snapshot;
      }
      if (input.action === "publish") {
        status = "published";
        publishedAt = publishedAt || new Date().toISOString();
        live = {
          ...fields,
          searchText: textContent(fields.content),
          liveUpdatedAt: new Date().toISOString(),
          tagSlugs: fields.tags.map(blogSlug),
        } as ArticleFields;
        liveSlug = fields.slug;
        scheduledAt = null;
      }
      if (input.action === "schedule") {
        const time = new Date(input.scheduledAt || "");
        if (
          !Number.isFinite(time.getTime()) ||
          time.getTime() < Date.now() + 30000
        )
          throw new BlogError(
            "Schedule at least one minute into the future. Times are in Asia/Kolkata.",
          );
        status = "scheduled";
        scheduledAt = time.toISOString();
        scheduledSnapshot = {
          ...fields,
          searchText: textContent(fields.content),
          tagSlugs: fields.tags.map(blogSlug),
        };
      }
      if (
        ["unpublish", "archive", "restore", "delete"].includes(input.action)
      ) {
        status = input.action === "archive" ? "archived" : "draft";
        live = null;
        liveSlug = null;
        scheduledAt = null;
        deletedAt = input.action === "delete" ? new Date().toISOString() : null;
      }
      if (input.action === "restore-revision") {
        status = "draft";
        live = null;
        liveSlug = null;
        scheduledAt = null;
      }
      await tx`insert into ${blogTable("blog_revisions")}(article_id,revision,snapshot,actor) values(${id},${row.revision},${tx.json(blogJSON(row))}::jsonb,${actor}) on conflict do nothing`;
      if (row.revision > 100)
        await tx`delete from ${blogTable("blog_revisions")} where article_id=${id} and revision<${row.revision - 100}`;
      if (publishing && row.live_slug && row.live_slug !== fields.slug)
        await tx`insert into ${blogTable("blog_redirects")}(slug,article_id) values(${row.live_slug},${id}) on conflict(slug) do update set article_id=excluded.article_id`;
      const [updated] = await tx<
        Row[]
      >`update ${blogTable("blog_articles")} set title=${fields.title},slug=${fields.slug},fields=${tx.json(blogJSON(fields))}::jsonb,
        category_slug=${fields.categorySlug || null},author_id=${fields.authorId || null},cover_image_id=${fields.coverImageId},og_image_id=${fields.ogImageId},
        status=${status},live_snapshot=${live ? tx.json(blogJSON(live)) : null}::jsonb,live_slug=${liveSlug},scheduled_snapshot=${scheduledSnapshot ? tx.json(blogJSON(scheduledSnapshot)) : null}::jsonb,
        published_at=${publishedAt}::timestamptz,scheduled_at=${scheduledAt}::timestamptz,deleted_at=${deletedAt}::timestamptz,
        revision=revision+1,updated_at=now(),last_edited_by=${actor},last_mutation_id=${input.mutationId} where id=${id} returning *`;
      await tx`delete from ${blogTable("blog_media_references")} where article_id=${id}`;
      // Preserve references in both the working draft and the currently published snapshot.
      if (live) {
        for (const mediaId of await checkReferences(tx, live, false))
          refs.add(mediaId);
      }
      if (scheduledSnapshot) {
        for (const mediaId of await checkReferences(
          tx,
          scheduledSnapshot as ArticleFields,
          false,
        ))
          refs.add(mediaId);
      }
      for (const mediaId of refs)
        await tx`insert into ${blogTable("blog_media_references")}(article_id,media_id) values(${id},${mediaId}) on conflict do nothing`;
      await tx`insert into ${blogTable("blog_audit")}(article_id,action,actor) values(${id},${input.action},${actor})`;
      return articleFromRow(updated);
    });
  } catch (error) {
    if ((error as { code?: string }).code === "23505")
      throw new BlogError(
        "That URL is already in use. Choose a unique slug.",
        409,
      );
    if ((error as { code?: string }).code === "23503")
      throw new BlogError(
        "A selected author, category or image no longer exists. Refresh the editor.",
        409,
      );
    throw error;
  }
}
export async function publishDueArticles() {
  const sql = blogSql();
  const [pending] =
    await sql`select id from ${blogTable("blog_articles")} where status='scheduled' and scheduled_at<=now() and deleted_at is null limit 1`;
  if (!pending) return;
  await sql.begin(async (transaction) => {
    const tx = transaction as unknown as typeof sql;
    await tx`select pg_advisory_xact_lock(853019211)`;
    const due = await tx<
      Row[]
    >`select * from ${blogTable("blog_articles")} where status='scheduled' and scheduled_at<=now() and deleted_at is null order by scheduled_at for update skip locked limit 50`;
    for (const row of due) {
      const [scheduled] =
        await tx`select scheduled_snapshot from ${blogTable("blog_articles")} where id=${row.id}`;
      const fields = scheduled.scheduled_snapshot as ArticleFields;
      if (!fields || publishingIssues(fields).length) continue;
      if (row.live_slug && row.live_slug !== fields.slug)
        await tx`insert into ${blogTable("blog_redirects")}(slug,article_id) values(${row.live_slug},${row.id}) on conflict do nothing`;
      await tx`insert into ${blogTable("blog_revisions")}(article_id,revision,snapshot,actor) values(${row.id},${row.revision},${tx.json(blogJSON(row))}::jsonb,'scheduler') on conflict do nothing`;
      await tx`update ${blogTable("blog_articles")} set status='published',live_snapshot=${tx.json(blogJSON({ ...fields, liveUpdatedAt: iso(row.scheduled_at) }))}::jsonb,live_slug=${fields.slug},published_at=coalesce(published_at,scheduled_at),scheduled_at=null,scheduled_snapshot=null,revision=revision+1,updated_at=now(),last_edited_by='scheduler' where id=${row.id}`;
      await tx`insert into ${blogTable("blog_audit")}(article_id,action,actor) values(${row.id},'scheduled-publish','scheduler')`;
    }
  });
}
async function publicRecord(
  row: Row,
  options: BlogOptions,
): Promise<PublicArticle> {
  const fields = row.live_snapshot!;
  return {
    ...fields,
    id: row.id,
    slug: row.live_slug!,
    publishedAt: iso(row.published_at)!,
    updatedAt: String(
      (fields as ArticleFields & { liveUpdatedAt?: string }).liveUpdatedAt ||
        iso(row.published_at),
    ),
    category: options.categories.find((c) => c.slug === fields.categorySlug)!,
    author: options.authors.find((a) => a.id === fields.authorId)!,
    cover: options.media.find((m) => m.id === fields.coverImageId) || null,
    ogImage: options.media.find((m) => m.id === fields.ogImageId) || null,
  };
}
async function publicOptions(rows: Row[]): Promise<BlogOptions> {
  const taxonomy = await getBlogTaxonomy();
  const ids = [
    ...new Set(
      rows
        .flatMap((row) => [
          row.live_snapshot?.coverImageId,
          row.live_snapshot?.ogImageId,
        ])
        .filter(Boolean),
    ),
  ];
  const media = ids.length
    ? await blogSql()<
        BlogMedia[]
      >`select id,url,filename,alt,caption,width,height,provider from ${blogTable("blog_media")} where id in ${blogSql()(ids)}`
    : [];
  return { ...taxonomy, media, uploadsConfigured: false };
}
export const listPublicArticles = cache(
  async (
    query: {
      page?: number;
      limit?: number;
      q?: string;
      category?: string;
      tag?: string;
      author?: string;
    } = {},
  ) => {
    if (!blogDatabaseConfigured())
      return {
        articles: [] as PublicArticle[],
        total: 0,
        page: 1,
        pages: 1,
        unavailable: false,
      };
    try {
      await ensureBlogDatabase();
      await publishDueArticles();
      const sql = blogSql();
      const term = (query.q || "").trim().slice(0, 200);
      const limit = Math.max(1, Math.min(50, query.limit || 9));
      const condition = sql`live_snapshot is not null and published_at<=now() and deleted_at is null
      and (${!query.category} or live_snapshot->>'categorySlug'=${query.category || ""})
      and (${!query.author} or live_snapshot->>'authorId'=${query.author || ""})
      and (${!query.tag} or coalesce(live_snapshot->'tagSlugs','[]'::jsonb) ? ${query.tag || ""})
      and (${!term} or search_document @@ websearch_to_tsquery('english',${term || "no-query"}) or live_snapshot->>'title' ilike ${`%${term}%`})`;
      const [count] =
        await sql`select count(*)::integer as total from ${blogTable("blog_articles")} where ${condition}`;
      const pages = Math.max(1, Math.ceil(count.total / limit));
      const page = Math.max(
        1,
        Math.min(pages, Math.floor(Number(query.page)) || 1),
      );
      const rows = await sql<
        Row[]
      >`select * from ${blogTable("blog_articles")} where ${condition} order by (coalesce((live_snapshot->>'featured')::boolean,false) and ${!term && !query.category && !query.tag && !query.author}) desc,ts_rank(search_document,websearch_to_tsquery('english',${term || "no-query"})) desc,published_at desc,id limit ${limit} offset ${(page - 1) * limit}`;
      const options = await publicOptions(rows);
      return {
        articles: await Promise.all(
          rows.map((row) => publicRecord(row, options)),
        ),
        total: count.total,
        page,
        pages,
        unavailable: false,
      };
    } catch {
      console.error("Journal content could not be loaded.");
      return {
        articles: [] as PublicArticle[],
        total: 0,
        page: 1,
        pages: 1,
        unavailable: true,
      };
    }
  },
);
export const getPublicArticle = cache(async (slug: string) => {
  if (!blogDatabaseConfigured()) return null;
  await ensureBlogDatabase();
  await publishDueArticles();
  const sql = blogSql();
  const [row] = await sql<
    Row[]
  >`select * from ${blogTable("blog_articles")} where live_slug=${slug} and live_snapshot is not null and published_at<=now() and deleted_at is null`;
  if (row)
    return {
      article: await publicRecord(row, await publicOptions([row])),
      redirect: null,
    };
  const [alias] =
    await sql`select a.live_slug from ${blogTable("blog_redirects")} r join ${blogTable("blog_articles")} a on a.id=r.article_id where r.slug=${slug} and a.live_snapshot is not null and a.deleted_at is null and a.published_at<=now()`;
  return alias ? { article: null, redirect: String(alias.live_slug) } : null;
});
export async function revisionsForArticle(id: string) {
  await ensureBlogDatabase();
  return blogSql()`select revision,created_at as "createdAt",actor from ${blogTable("blog_revisions")} where article_id=${id} order by revision desc limit 40`;
}
