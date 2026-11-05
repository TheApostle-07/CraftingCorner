import { notFound, permanentRedirect } from "next/navigation";
import ArticleView from "@/components/blog/ArticleView";
import { getPublicArticle, listPublicArticles } from "@/lib/blog/service";
import { loadAllProducts, loadSiteData } from "@/lib/loaders.server";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getPublicArticle(slug);
  if (!result?.article) return { robots: { index: false, follow: false } };
  const a = result.article;
  const base = pageMetadata(
    a.seoTitle || `${a.title} | Crafting Corner`,
    a.seoDescription || a.excerpt,
    a.canonicalUrl || `/blog/${a.slug}`,
    a.ogImage?.url || a.cover?.url,
    a.noIndex,
  );
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      authors: [a.author.name],
    },
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const result = await getPublicArticle(slug);
  if (result?.redirect) permanentRedirect(`/blog/${result.redirect}`);
  if (!result?.article) notFound();
  const article = result.article;
  const [suggestions, products, site] = await Promise.all([
    listPublicArticles({ category: article.categorySlug, limit: 4 }),
    loadAllProducts(),
    loadSiteData(),
  ]);
  const related = suggestions.articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);
  return (
    <ArticleView
      article={article}
      related={related}
      site={site}
      products={products
        .filter((p) => article.relatedProductSlugs.includes(p.slug))
        .slice(0, 3)}
    />
  );
}
