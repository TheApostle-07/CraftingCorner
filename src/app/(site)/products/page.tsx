// src/app/products/page.tsx
import ProductCard from '@/components/ProductCard';
import productTypes from '@/data/productTypes.json';
import { loadAllProducts } from '@/lib/loaders.server';
import type { Product } from '@/lib/types';



export const dynamic = 'force-dynamic'; 
// ───────────────────────────────────────────────────────────────────────────────
// Page component
// ───────────────────────────────────────────────────────────────────────────────
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const raw = await loadAllProducts();

  // Ensure we end up with a strongly‑typed Product[]
  const products: Product[] = Array.isArray(raw)
    ? (raw as Product[])
    : (Object.values(raw).flat() as Product[]);

  // ── Optional “Browse by Products” filter — uses pre‑grouped JSON ──
  const browseType = searchParams?.type?.toLowerCase();
  let filtered: Product[] = products;

  /**
   * productTypes.json only stores title / slug / price / img for the
   * browse‑tiles on the home page, **not** the full `Product` shape.
   * To avoid type errors, we:
   *   1. Treat it as a map of slug‑arrays.
   *   2. Cross‑reference those slugs with the master product list we
   *      already loaded (`products`) so the final array is still the
   *      fully‑typed `Product[]`.
   */
  const typeMap = productTypes as Record<string, { slug: string }[]>;

  if (browseType) {
    /**
     * 1) If a pre‑defined “browse” type (sofa‑set, dining‑table‑set, …)
     *    – preserve the display order of slugs as given in productTypes.json
     *    – fill up (or trim) to **exactly 9 unique products**
     *
     * 2) Otherwise treat `browseType` as a plain category filter.
     */
    if (typeMap[browseType]) {
      const slugOrder = typeMap[browseType].map((i) => i.slug.toLowerCase());
      const slugSet = new Set(slugOrder);

      // Preserve order from the JSON
      const matched = slugOrder
        .map((slug) => products.find((p) => p.slug === slug))
        .filter(Boolean) as Product[];

      // If fewer than 9, top‑up with other unique products (same category first)
      let topUp: Product[] = [];
      if (matched.length < 6) {
        const need = 6 - matched.length;

        // 1. Prefer same category as the first matched item (if any)
        const primaryCat = matched[0]?.category?.toLowerCase();
        topUp = products
          .filter(
            (p) =>
              !slugSet.has(p.slug) &&
              p.category?.toLowerCase() === primaryCat,
          )
          .slice(0, need);

        // 2. Still short? grab from anywhere else (no dupes)
        if (topUp.length < need) {
          const stillNeed = need - topUp.length;
          topUp = [
            ...topUp,
            ...products
              .filter((p) => !slugSet.has(p.slug) && !topUp.includes(p))
              .slice(0, stillNeed),
          ];
        }
      }

      filtered = [...matched, ...topUp].slice(0, 9);
    } else {
      // Simple category match
      filtered = products
        .filter((p) => p.category?.toLowerCase() === browseType)
        .slice(0, 9);
    }
  }

  // — Ensure we never show duplicates (e.g. if the same slug exists in two sources)
  filtered = Array.from(
    new Map(filtered.map((p) => [p.slug, p])).values(),
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
