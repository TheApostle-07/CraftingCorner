import { notFound } from "next/navigation";
import BlogListing from "@/components/blog/BlogListing";
import { getBlogOptions, listPublicArticles } from "@/lib/blog/service";
import { pageMetadata } from "@/lib/seo";
import { searchPage, type SearchParam } from "@/lib/searchParams";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: SearchParam; page?: SearchParam }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = (await getBlogOptions()).categories.find(
    (c) => c.slug === slug,
  );
  if (!category) return { robots: { index: false } };
  const data = await listPublicArticles({ category: slug, limit: 1 });
  return pageMetadata(
    `${category.name} | Crafting Corner Journal`,
    category.description,
    `/blog/category/${slug}`,
    undefined,
    data.total === 0,
  );
}
export default async function CategoryBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const category = (await getBlogOptions()).categories.find(
    (c) => c.slug === slug,
  );
  if (!category) notFound();
  return (
    <BlogListing
      title={category.name}
      description={category.description}
      query={{ category: slug, q: query.q, page: searchPage(query.page) }}
      base={`/blog/category/${slug}`}
    />
  );
}
