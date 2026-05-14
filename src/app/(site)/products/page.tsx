// src/app/products/page.tsx
import ProductCard from '@/components/ProductCard';
import { loadAllProducts, loadProductTypes } from '@/lib/loaders.server';
import type { Product, ProductType } from '@/lib/types';

export const dynamic = 'force-dynamic'; 
// ───────────────────────────────────────────────────────────────────────────────
// Page component
// ───────────────────────────────────────────────────────────────────────────────
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const products = await loadAllProducts();
  const productTypes = await loadProductTypes();
  const browseType = searchParams?.type?.toLowerCase();
  let filtered: Product[] = products;
  const productTypeSlugs = new Set(
    productTypes.map((type: ProductType) => type.slug),
  );

  if (browseType) {
    if (productTypeSlugs.has(browseType)) {
      filtered = products
        .filter((product) => product.productTypeSlug === browseType)
        .slice(0, 9);
    } else {
      filtered = products
        .filter((product) => product.categorySlug?.toLowerCase() === browseType)
        .slice(0, 9);
    }
  }

  filtered = Array.from(
    new Map(filtered.map((product) => [product.id || product.slug, product])).values(),
  );
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-32">
        {browseType && (
          <h1 className="mb-8 text-center font-display text-3xl font-semibold capitalize">
            {browseType.replace(/-/g, ' ')}
          </h1>
        )}

        {filtered.length ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((p, i) => (
              <div
                key={p.slug}
                className="animate-fadeIn"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-24 text-center text-lg text-charcoal/70">
            No products found in this category.
          </p>
        )}
      </main>
    </>
  );
}
