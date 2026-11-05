import { blogTable } from "@/lib/blog/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  authorizeBlog,
  readBlogBody,
  readLimitedBody,
} from "@/lib/blog/security";
import {
  createArticle,
  getAdminArticle,
  getBlogOptions,
  listAdminArticles,
  listBlogMedia,
  mutateArticle,
  newArticleFields,
  revisionsForArticle,
} from "@/lib/blog/service";
import { BlogError } from "@/lib/blog/validation";
import { blogSlug } from "@/lib/blog/content";
import { blogSql } from "@/lib/blog/db";
import { deleteBlogImage, uploadBlogImage } from "@/lib/blog/media";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 30;
const mutation = z
  .object({
    action: z.enum([
      "save",
      "publish",
      "schedule",
      "unpublish",
      "archive",
      "restore",
      "delete",
      "restore-revision",
    ]),
    revision: z.number().int().positive(),
    mutationId: z.uuid(),
    fields: z.unknown().optional(),
    scheduledAt: z.string().optional(),
    restoreRevision: z.number().int().positive().optional(),
  })
  .strict();
async function handle(
  request: Request,
  context: { params: Promise<{ parts?: string[] }> },
) {
  try {
    const actor = await authorizeBlog(request);
    const { parts = [] } = await context.params;
    const method = request.method;
    const url = new URL(request.url);
    const reply = (value: unknown, status = 200) =>
      NextResponse.json(value, {
        status,
        headers: {
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    if (method === "GET" && parts.length === 0)
      return reply(
        await listAdminArticles({
          q: url.searchParams.get("q") || "",
          status: url.searchParams.get("status") || "",
          page: Number(url.searchParams.get("page")) || 1,
        }),
      );
    if (method === "GET" && parts[0] === "options")
      return reply(await getBlogOptions());
    if (method === "GET" && parts[0] === "media")
      return reply(
        await listBlogMedia({
          q: url.searchParams.get("q") || "",
          page: Number(url.searchParams.get("page")) || 1,
        }),
      );
    if (method === "GET" && parts[0] === "articles" && parts.length === 2)
      return reply({ article: await getAdminArticle(parts[1]) });
    if (
      method === "GET" &&
      parts[0] === "articles" &&
      parts[2] === "revisions"
    ) {
      await getAdminArticle(parts[1]);
      return reply({ revisions: await revisionsForArticle(parts[1]) });
    }
    if (method === "POST" && parts[0] === "articles" && parts.length === 1) {
      const body = z
        .object({ clientKey: z.uuid() })
        .parse(await readBlogBody(request));
      return reply(
        { article: await createArticle(actor, body.clientKey) },
        201,
      );
    }
    if (
      method === "POST" &&
      parts[0] === "articles" &&
      parts[2] === "duplicate"
    ) {
      const source = await getAdminArticle(parts[1]);
      const { clientKey } = z
        .object({ clientKey: z.uuid() })
        .parse(await readBlogBody(request));
      const { id: _id, ...rest } = source;
      void _id;
      const fields = {
        ...newArticleFields(),
        title: `${source.title} (copy)`,
        subtitle: rest.subtitle,
        excerpt: rest.excerpt,
        content: rest.content,
        categorySlug: rest.categorySlug,
        authorId: rest.authorId,
        coverImageId: rest.coverImageId,
        coverAlt: rest.coverAlt,
        tags: rest.tags,
        seoDescription: rest.seoDescription,
        relatedProductSlugs: rest.relatedProductSlugs,
      };
      return reply(
        { article: await createArticle(actor, clientKey, fields) },
        201,
      );
    }
    if (method === "PATCH" && parts[0] === "articles" && parts.length === 2) {
      const body = mutation.parse(await readBlogBody(request));
      const article = await mutateArticle(parts[1], actor, body);
      revalidatePath("/blog", "layout");
      revalidatePath("/");
      revalidatePath("/sitemap.xml");
      return reply({
        article,
        message:
          body.action === "save"
            ? "Draft saved."
            : body.action === "schedule"
              ? "Publication scheduled."
              : body.action === "publish"
                ? "Article published."
                : "Article updated.",
      });
    }
    if (method === "POST" && parts[0] === "media") {
      if (Number(request.headers.get("content-length")) > 4.3 * 1024 * 1024)
        throw new BlogError("Upload a file up to 4 MB.", 413);
      const bytes = await readLimitedBody(
        request,
        Math.ceil(4.3 * 1024 * 1024),
      );
      const form = await new Response(bytes, {
        headers: { "Content-Type": request.headers.get("content-type") || "" },
      })
        .formData()
        .catch(() => {
          throw new BlogError("Choose a valid photograph upload.");
        });
      const file = form.get("file");
      if (!(file instanceof File)) throw new BlogError("Choose an image file.");
      return reply(
        {
          media: await uploadBlogImage(
            file,
            String(form.get("alt") || ""),
            String(form.get("caption") || ""),
          ),
        },
        201,
      );
    }
    const sql = blogSql();
    if (method === "PATCH" && parts[0] === "media" && parts[1]) {
      const body = z
        .object({ alt: z.string().max(500), caption: z.string().max(1000) })
        .parse(await readBlogBody(request));
      const [media] =
        await sql`update ${blogTable("blog_media")} set alt=${body.alt},caption=${body.caption},updated_at=now() where id=${parts[1]} returning id`;
      if (!media) throw new BlogError("Image not found.", 404);
      return reply({ ok: true });
    }
    if (method === "DELETE" && parts[0] === "media" && parts[1]) {
      await deleteBlogImage(parts[1]);
      return reply({ ok: true });
    }
    if (method === "POST" && parts[0] === "categories") {
      const body = z
        .object({
          slug: z.string().min(1).max(100),
          name: z.string().trim().min(2).max(100),
          description: z.string().max(600),
          originalSlug: z.string().max(100).optional(),
        })
        .parse(await readBlogBody(request));
      const slug = blogSlug(body.slug);
      if (!slug) throw new BlogError("Choose a category slug.");
      if (body.originalSlug) {
        if (body.originalSlug !== slug)
          throw new BlogError("Existing category URLs cannot be changed.");
        const [updated] =
          await sql`update ${blogTable("blog_categories")} set name=${body.name},description=${body.description} where slug=${slug} returning slug`;
        if (!updated) throw new BlogError("Category no longer exists.", 404);
      } else
        await sql`insert into ${blogTable("blog_categories")}(slug,name,description) values(${slug},${body.name},${body.description})`;
      return reply({ ok: true });
    }
    if (method === "POST" && parts[0] === "authors") {
      const body = z
        .object({
          id: z.string().max(100).optional(),
          name: z.string().trim().min(2).max(150),
          slug: z.string().min(1).max(100),
          bio: z.string().max(1500),
          isOrganization: z.boolean(),
        })
        .parse(await readBlogBody(request));
      await sql`insert into ${blogTable("blog_authors")}(id,slug,name,bio,is_organization) values(${body.id || randomUUID()},${blogSlug(body.slug)},${body.name},${body.bio},${body.isOrganization}) on conflict(id) do update set name=excluded.name,bio=excluded.bio,is_organization=excluded.is_organization`;
      return reply({ ok: true });
    }
    if (
      method === "DELETE" &&
      ["categories", "authors"].includes(parts[0]) &&
      parts[1]
    ) {
      const key = parts[0] === "categories" ? "categorySlug" : "authorId";
      const [used] =
        await sql`select id from ${blogTable("blog_articles")} where fields->>${key}=${parts[1]} or live_snapshot->>${key}=${parts[1]} or scheduled_snapshot->>${key}=${parts[1]} limit 1`;
      if (used)
        throw new BlogError(
          "This entry is used by an article. Reassign its articles before deleting it.",
          409,
        );
      if (parts[0] === "categories")
        await sql`delete from ${blogTable("blog_categories")} where slug=${parts[1]}`;
      else
        await sql`delete from ${blogTable("blog_authors")} where id=${parts[1]}`;
      return reply({ ok: true });
    }
    throw new BlogError("This action is not available.", 404);
  } catch (error) {
    const status =
      error instanceof BlogError
        ? error.status
        : error instanceof z.ZodError
          ? 400
          : (error as { code?: string }).code === "23505"
            ? 409
            : 503;
    const message =
      error instanceof BlogError
        ? error.message
        : error instanceof z.ZodError
          ? "Check the submitted fields."
          : status === 409
            ? "That URL already exists. Choose another."
            : "We could not complete this request. Your draft has not been discarded. Check the database or storage connection and retry.";
    if (status === 503)
      console.error(
        "Blog request failed:",
        (error as { code?: string }).code || "dependency unavailable",
      );
    return NextResponse.json(
      { message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
