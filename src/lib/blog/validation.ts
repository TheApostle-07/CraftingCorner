import { z } from "zod";
import {
  blogSlug,
  CONTENT_SCHEMA_VERSION,
  textContent,
  validateDocument,
} from "./content";
import type { ArticleFields, RichNode } from "./types";

export class BlogError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export const articleFieldsSchema = z
  .object({
    title: z.string().max(250),
    slug: z
      .string()
      .min(1)
      .max(160)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    subtitle: z.string().max(500),
    excerpt: z.string().max(1500),
    content: z.unknown(),
    contentSchemaVersion: z.literal(CONTENT_SCHEMA_VERSION),
    categorySlug: z.string().max(100),
    authorId: z.string().max(100),
    coverImageId: z.string().max(100).nullable(),
    ogImageId: z.string().max(100).nullable(),
    coverAlt: z.string().max(500),
    featured: z.boolean(),
    tags: z.array(z.string().min(1).max(60)).max(20),
    seoTitle: z.string().max(250),
    seoDescription: z.string().max(1000),
    canonicalUrl: z.string().max(2048),
    focusKeyword: z.string().max(150),
    relatedProductSlugs: z.array(z.string().max(160)).max(12),
    noIndex: z.boolean(),
  })
  .strict();
export function parseArticleFields(raw: unknown): ArticleFields {
  const result = articleFieldsSchema.safeParse(raw);
  if (!result.success)
    throw new BlogError(
      result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .slice(0, 4)
        .join(" "),
    );
  const fields = result.data;
  let content: ArticleFields["content"];
  try {
    content = validateDocument(fields.content);
  } catch (error) {
    throw new BlogError((error as Error).message, 422);
  }
  if (fields.canonicalUrl) {
    try {
      const url = new URL(fields.canonicalUrl);
      if (url.protocol !== "https:" || url.username || url.password)
        throw new Error();
    } catch {
      throw new BlogError("Canonical URL must be a complete HTTPS URL.");
    }
  }
  return {
    ...fields,
    coverImageId: fields.coverImageId ?? null,
    ogImageId: fields.ogImageId ?? null,
    content,
    tags: [...new Set(fields.tags.map((t) => t.trim()).filter(Boolean))],
  };
}
export function publishingIssues(fields: ArticleFields) {
  const issues: string[] = [];
  if (!fields.title.trim() || fields.title.trim().length < 3)
    issues.push("Add an article title.");
  if (!fields.excerpt.trim()) issues.push("Add an excerpt.");
  if (!fields.categorySlug) issues.push("Choose a category.");
  if (!fields.authorId) issues.push("Choose an author.");
  if (!fields.coverImageId || !fields.coverAlt.trim())
    issues.push("Choose a cover image and add its alt text.");
  if (textContent(fields.content).trim().length < 40)
    issues.push("Add article content before publishing.");
  const visit = (node: RichNode) => {
    if (node.type === "image" && !String(node.attrs?.alt || "").trim())
      issues.push("Add alt text to every article image.");
    node.content?.forEach(visit);
  };
  visit(fields.content);
  return [...new Set(issues)];
}
export const isPublicArticle = (
  article: {
    live: unknown;
    publishedAt: string | null;
    deletedAt?: string | null;
  },
  now = Date.now(),
) =>
  Boolean(
    article.live &&
      !article.deletedAt &&
      article.publishedAt &&
      new Date(article.publishedAt).getTime() <= now,
  );
export function kolkataToUTC(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new BlogError("Choose a valid date and time in Asia/Kolkata.");
  const date = new Date(`${value}:00+05:30`);
  if (
    !Number.isFinite(date.getTime()) ||
    new Date(date.getTime() + 19800000).toISOString().slice(0, 16) !== value
  )
    throw new BlogError("Invalid scheduled date.");
  return date.toISOString();
}
export function starterSlug(title: string, suffix: string) {
  return `${blogSlug(title) || "untitled"}-${suffix}`;
}
