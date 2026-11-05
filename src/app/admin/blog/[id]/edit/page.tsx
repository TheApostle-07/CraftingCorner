import { getAdminArticle, getEditorOptions } from "@/lib/blog/service";
import { loadAllProducts } from "@/lib/loaders.server";
import ArticleEditor from "@/components/admin/blog/ArticleEditor";
import { requireBlogAdmin } from "@/lib/blog/admin.server";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireBlogAdmin();
  const { id } = await params;
  const [article, products] = await Promise.all([
    getAdminArticle(id),
    loadAllProducts(),
  ]);
  const options = await getEditorOptions(article);
  return (
    <ArticleEditor
      key={article.id}
      initial={article}
      options={options}
      products={products.map((p) => ({ slug: p.slug, title: p.title }))}
    />
  );
}
