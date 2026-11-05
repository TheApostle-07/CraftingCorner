import Link from "next/link";
import { getAdminArticle, getEditorOptions } from "@/lib/blog/service";
import ArticleView from "@/components/blog/ArticleView";
import { readPublicContent } from "@/lib/adminContent.server";
import type { PublicArticle } from "@/lib/blog/types";
import { requireBlogAdmin } from "@/lib/blog/admin.server";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireBlogAdmin();
  const { id } = await params;
  const [draft, content] = await Promise.all([
    getAdminArticle(id),
    readPublicContent(),
  ]);
  const options = await getEditorOptions(draft);
  const article: PublicArticle = {
    ...draft,
    publishedAt: draft.publishedAt || draft.createdAt,
    updatedAt: draft.updatedAt,
    category: options.categories.find((c) => c.slug === draft.categorySlug) || {
      slug: "",
      name: "Uncategorised",
      description: "",
    },
    author: options.authors.find((a) => a.id === draft.authorId) || {
      id: "",
      slug: "",
      name: "Author not selected",
      bio: "",
      isOrganization: true,
    },
    cover: options.media.find((m) => m.id === draft.coverImageId) || null,
    ogImage: options.media.find((m) => m.id === draft.ogImageId) || null,
  };
  return (
    <div className="rounded-2xl bg-[#f8f5ee]">
      <div className="blog-notice flex flex-wrap items-center justify-between gap-3">
        <p>Private preview · saved working draft · not visible to visitors</p>
        <Link href={`/admin/blog/${id}/edit`} className="blog-secondary">
          Continue editing
        </Link>
      </div>
      <ArticleView article={article} site={content.site} preview />
    </div>
  );
}
