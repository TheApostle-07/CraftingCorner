import { indexableArticles } from "@/lib/blog/discovery";
import { absoluteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";
const xml = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
export async function GET() {
  try {
    const articles = (await indexableArticles())
      .filter(
        (a) =>
          !a.fields.canonicalUrl ||
          a.fields.canonicalUrl === absoluteUrl(`/blog/${a.slug}`),
      )
      .slice(0, 50);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Crafting Corner Journal</title><link>${absoluteUrl("/blog")}</link><description>Considered furniture, materials and everyday living.</description><language>en-IN</language><atom:link href="${absoluteUrl("/blog/feed.xml")}" rel="self" type="application/rss+xml"/>${articles.map((a) => `<item><title>${xml(a.fields.title)}</title><link>${absoluteUrl(`/blog/${a.slug}`)}</link><guid isPermaLink="true">${absoluteUrl(`/blog/${a.slug}`)}</guid><description>${xml(a.fields.excerpt)}</description><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
      {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      },
    );
  } catch {
    return new Response("The feed is temporarily unavailable.", {
      status: 503,
      headers: { "Retry-After": "60" },
    });
  }
}
