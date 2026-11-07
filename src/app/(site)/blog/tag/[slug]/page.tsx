import { notFound } from "next/navigation";
import BlogListing from "@/components/blog/BlogListing";
import { journalMetadata, journalPage, type JournalSearchParams } from "@/lib/blog/discovery";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<JournalSearchParams>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  return journalMetadata(
    `${slug.replace(/-/g, " ")} | Crafting Corner Journal`,
    `Explore stories about ${slug.replace(/-/g, " ")} from Crafting Corner.`,
    `/blog/tag/${slug}`,
    query,
    await journalPage(query, "tag", slug),
    true,
  );
}
export default async function TagBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const result = await journalPage(query, "tag", slug);
  if (!result.total && !result.unavailable && !(await journalPage({}, "tag", slug)).total) notFound();
  return (
    <BlogListing
      title={slug.replace(/-/g, " ")}
      query={{ tag: slug, q: query.q }}
      result={result}
      base={`/blog/tag/${slug}`}
    />
  );
}
