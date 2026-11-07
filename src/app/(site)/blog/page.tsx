import BlogListing from "@/components/blog/BlogListing";
import { journalMetadata, journalPage, type JournalSearchParams } from "@/lib/blog/discovery";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<JournalSearchParams>;
}) {
  const query = await searchParams;
  return journalMetadata(
    "Journal & Inspiration | Crafting Corner",
    "Furniture ideas, buying considerations, materials and thoughtful spaces from Crafting Corner.",
    "/blog",
    query,
    await journalPage(query),
  );
}
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<JournalSearchParams>;
}) {
  const query = await searchParams;
  return <BlogListing query={query} result={await journalPage(query)} />;
}
