export type BlogStatus = "draft" | "published" | "scheduled" | "archived";
export type RichNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
};
export type RichDocument = RichNode & { type: "doc"; content: RichNode[] };
export type BlogCategory = { slug: string; name: string; description: string };
export type BlogAuthor = {
  id: string;
  slug: string;
  name: string;
  bio: string;
  isOrganization: boolean;
};
export type BlogMedia = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  filename: string;
  width: number;
  height: number;
  provider: string;
  publicId?: string;
  createdAt: string;
  uses?: number;
};
export type ArticleFields = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: RichDocument;
  contentSchemaVersion: number;
  categorySlug: string;
  authorId: string;
  coverImageId: string | null;
  coverAlt: string;
  featured: boolean;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImageId: string | null;
  focusKeyword: string;
  relatedProductSlugs: string[];
  noIndex: boolean;
};
export type Article = ArticleFields & {
  id: string;
  status: BlogStatus;
  revision: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  scheduledAt: string | null;
  deletedAt: string | null;
  lastEditedBy: string;
  live: ArticleFields | null;
  liveSlug: string | null;
};
export type PublicArticle = ArticleFields & {
  id: string;
  publishedAt: string;
  updatedAt: string;
  category: BlogCategory;
  author: BlogAuthor;
  cover: BlogMedia | null;
  ogImage: BlogMedia | null;
};
export type BlogOptions = {
  categories: BlogCategory[];
  authors: BlogAuthor[];
  media: BlogMedia[];
  uploadsConfigured: boolean;
};
