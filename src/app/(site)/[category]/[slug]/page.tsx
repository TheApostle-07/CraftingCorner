import { notFound, permanentRedirect, redirect } from 'next/navigation';
import legacyProducts from '@/data/products.json';
import { loadAllProducts } from '@/lib/loaders.server';
export const dynamic = 'force-dynamic';
export default async function CategoryProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = (await loadAllProducts()).find((p) => p.slug === slug);
  const legacy = legacyProducts.some(
    (p) => p.slug === slug && p.categorySlug === category,
  );
  if (product && (product.categorySlug === category || legacy))
    permanentRedirect(`/products/${encodeURIComponent(slug)}`);
  if (legacy) redirect('/products');
  notFound();
}
