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
  const category = (await publicJournalTaxonomy()).categories.find(
    (c) => c.slug === slug,
  );
  if (!category) return { robots: { index: false } };
  const query = await searchParams;
  return journalMetadata(
    `${category.name} | Crafting Corner Journal`,
    category.description || `Read our Journal articles on ${category.name.toLowerCase()}.`,
    `/blog/category/${slug}`,
    query,
    await journalPage(query, "category", slug),
  );
}
export default async function CategoryBlog({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const category = (await publicJournalTaxonomy()).categories.find(
    (c) => c.slug === slug,
  );
  if (!category) notFound();
  return (
    <BlogListing
      title={category.name}
      description={category.description}
      query={{ category: slug, q: query.q }}
      result={await journalPage(query, "category", slug)}
      base={`/blog/category/${slug}`}
    />
  );
}
