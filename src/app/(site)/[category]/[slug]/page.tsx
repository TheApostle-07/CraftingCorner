import { notFound, redirect } from 'next/navigation';
import { readPublicContent } from '@/lib/adminContent.server';
export const dynamic = 'force-dynamic';
export default async function CategoryProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const content = await readPublicContent();
  const product = content.products.find(
    (p) => p.slug === slug && (p.categorySlug || p.category) === category,
  );
  if (!product) notFound();
  if (product.visibility === 'draft')
    redirect(`/products?category=${encodeURIComponent(category)}`);
  redirect(`/products/${encodeURIComponent(slug)}`);
}
