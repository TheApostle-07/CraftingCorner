import { notFound } from "next/navigation";
import BlogListing from "@/components/blog/BlogListing";
import { listPublicArticles } from "@/lib/blog/service";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(
    `${slug.replace(/-/g, " ")} | Crafting Corner Journal`,
    "Explore related stories from Crafting Corner.",
    `/blog/tag/${slug}`,
    undefined,
    true,
  );
}
export default async function TagBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const result = await listPublicArticles({ tag: slug, limit: 1 });
  if (!result.total) notFound();
  return (
    <BlogListing
      title={slug.replace(/-/g, " ")}
      query={{ tag: slug, q: query.q, page: Number(query.page) || 1 }}
      base={`/blog/tag/${slug}`}
    />
  );
}
