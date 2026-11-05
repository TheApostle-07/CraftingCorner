import type { MetadataRoute } from "next";
import { loadAllProducts, loadCategories } from "@/lib/loaders.server";
import { indexableArticles } from "@/lib/blog/discovery";
import { absoluteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    loadAllProducts(),
    loadCategories(),
    indexableArticles(),
  ]);
  const entries: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/contact",
    "/products",
    "/blog",
  ].map((path) => ({ url: absoluteUrl(path) }));
  for (const p of products)
    entries.push({
      url: absoluteUrl(`/products/${p.slug}`),
      ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
      images: p.images?.map((i) => absoluteUrl(i.url)),
    });
  for (const c of categories) entries.push({ url: absoluteUrl(`/${c.slug}`) });
  const used = new Set<string>();
  for (const a of articles) {
    if (
      a.fields.canonicalUrl &&
      a.fields.canonicalUrl !== absoluteUrl(`/blog/${a.slug}`)
    )
      continue;
    entries.push({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: a.fields.liveUpdatedAt || a.publishedAt,
    });
    if (a.fields.categorySlug) used.add(a.fields.categorySlug);
  }
  for (const slug of used)
    entries.push({ url: absoluteUrl(`/blog/category/${slug}`) });
  return entries;
}
