import { notFound } from "next/navigation";
import BlogListing from "@/components/blog/BlogListing";
import { getBlogOptions, listPublicArticles } from "@/lib/blog/service";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const author = (await getBlogOptions()).authors.find((a) => a.slug === slug);
  if (!author) return { robots: { index: false } };
  const data = await listPublicArticles({ author: author.id, limit: 1 });
  return pageMetadata(
    `${author.name} | Crafting Corner Journal`,
    author.bio || `Articles by ${author.name}.`,
    `/blog/author/${slug}`,
    undefined,
    data.total === 0,
  );
}
export default async function AuthorBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const author = (await getBlogOptions()).authors.find((a) => a.slug === slug);
  if (!author) notFound();
  return (
    <BlogListing
      title={author.name}
      description={author.bio || "Stories from the Crafting Corner journal."}
      query={{ author: author.id, q: query.q, page: Number(query.page) || 1 }}
      base={`/blog/author/${slug}`}
    />
  );
}
