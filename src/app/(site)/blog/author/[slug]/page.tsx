import { notFound } from "next/navigation";
import BlogListing from "@/components/blog/BlogListing";
import { journalMetadata, journalPage, publicJournalTaxonomy, type JournalSearchParams } from "@/lib/blog/discovery";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<JournalSearchParams>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const author = (await publicJournalTaxonomy()).authors.find((a) => a.slug === slug);
  if (!author) return { robots: { index: false } };
  const query = await searchParams;
  return journalMetadata(
    `${author.name} | Crafting Corner Journal`,
    author.bio || `Articles by ${author.name}.`,
    `/blog/author/${slug}`,
    query,
    await journalPage(query, "author", author.id),
    true,
  );
}
export default async function AuthorBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const author = (await publicJournalTaxonomy()).authors.find((a) => a.slug === slug);
  if (!author) notFound();
  return (
    <BlogListing
      title={author.name}
      description={author.bio || "Stories from the Crafting Corner journal."}
      query={{ author: author.id, q: query.q }}
      result={await journalPage(query, "author", author.id)}
      base={`/blog/author/${slug}`}
    />
  );
}
