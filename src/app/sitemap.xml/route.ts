import { loadAllProducts, loadCategories } from "@/lib/loaders.server";
import { indexableArticles } from "@/lib/blog/discovery";
import { absoluteUrl, escapeXml } from "@/lib/seo";
import { getSiteStatus } from "@/lib/siteStatus";

export const dynamic = "force-dynamic";

type Entry = { url: string; lastModified?: string | Date; images?: string[] };

async function getEntries(): Promise<Entry[]> {
  const [products, categories, articles] = await Promise.all([
    loadAllProducts(),
    loadCategories(),
    indexableArticles(),
  ]);
  const entries: Entry[] = ["/", "/about", "/contact", "/products"].map(
    (path) => ({ url: absoluteUrl(path) }),
  );
  for (const product of products) {
    entries.push({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      images: product.images
        ?.filter(({ url }) => url)
        .map(({ url }) => absoluteUrl(url)),
    });
  }
  const rooms = new Set(products.map((product) => product.categorySlug));
  for (const category of categories) {
    if (category.slug === "custom" || rooms.has(category.slug))
      entries.push({ url: absoluteUrl(`/${category.slug}`) });
  }
  if (articles.length) entries.push({ url: absoluteUrl("/blog") });
  const journalCategories = new Set<string>();
  for (const article of articles) {
    entries.push({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: article.fields.liveUpdatedAt || article.publishedAt,
      images: article.coverUrl ? [absoluteUrl(article.coverUrl)] : undefined,
    });
    if (article.fields.categorySlug)
      journalCategories.add(article.fields.categorySlug);
  }
  for (const slug of journalCategories)
    entries.push({ url: absoluteUrl(`/blog/category/${slug}`) });
  return entries;
}

function renderEntry({ url, lastModified, images }: Entry) {
  const date = lastModified ? new Date(lastModified) : null;
  const lastmod =
    date && Number.isFinite(date.getTime())
      ? `<lastmod>${date.toISOString()}</lastmod>`
      : "";
  const imageNodes = [...new Set(images)].map(
    (image) =>
      `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`,
  );
  return `<url><loc>${escapeXml(url)}</loc>${lastmod}${imageNodes.join("")}</url>`;
}

export async function GET() {
  try {
    if ((await getSiteStatus()).active) {
      const entries = await getEntries();
      const seen = new Set<string>();
      const urls = entries.flatMap((entry) => {
        if (seen.has(entry.url)) return [];
        seen.add(entry.url);
        return [renderEntry(entry)];
      });
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>`,
        {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        },
      );
    }
  } catch {
    console.error("The sitemap data could not be loaded.");
  }
  return new Response("The sitemap is temporarily unavailable.", {
    status: 503,
    headers: { "Retry-After": "60", "Cache-Control": "no-store" },
  });
}
