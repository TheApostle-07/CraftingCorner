import BlogListing from "@/components/blog/BlogListing";
import { pageMetadata } from "@/lib/seo";
import {
  firstSearchParam,
  searchPage,
  type SearchParam,
} from "@/lib/searchParams";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: SearchParam; page?: SearchParam }>;
}) {
  const query = await searchParams;
  const page = searchPage(query.page);
  return pageMetadata(
    "Journal & Inspiration | Crafting Corner",
    "Furniture ideas, buying considerations, materials and thoughtful spaces from Crafting Corner.",
    `/blog${page > 1 ? "?page=" + page : ""}`,
    undefined,
    Boolean(firstSearchParam(query.q)),
  );
}
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: SearchParam; page?: SearchParam }>;
}) {
  const query = await searchParams;
  return <BlogListing query={{ q: query.q, page: searchPage(query.page) }} />;
}
