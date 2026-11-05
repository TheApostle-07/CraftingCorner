import BlogListing from "@/components/blog/BlogListing";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = await searchParams;
  return pageMetadata(
    "Journal & Inspiration | Crafting Corner",
    "Furniture ideas, buying considerations, materials and thoughtful spaces from Crafting Corner.",
    `/blog${Number(query.page) > 1 ? "?page=" + Number(query.page) : ""}`,
    undefined,
    Boolean(query.q),
  );
}
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = await searchParams;
  return (
    <BlogListing
      query={{ q: query.q?.slice(0, 200), page: Number(query.page) || 1 }}
    />
  );
}
