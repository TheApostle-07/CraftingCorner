import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import {
  loadAllProducts,
  loadCategories,
  loadProductTypes,
} from '@/lib/loaders.server';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'The Collection | Crafting Corner',
  description:
    'Discover furniture photographed in our Mohali showroom. Explore the details and enquire for your final quotation.',
};
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string; q?: string }>;
}) {
  const query = await searchParams;
  const [products, categories, types] = await Promise.all([
    loadAllProducts(),
    loadCategories(),
    loadProductTypes(),
  ]);
  const category = categories.find(
    (c) => c.slug === query.category || c.slug === query.type,
  );
  const type = types.find((t) => t.slug === query.type);
  const filtered = products.filter(
    (p) =>
      (!query.type ||
        (type
          ? p.productTypeSlug === type.slug
          : p.categorySlug === query.type)) &&
      (!query.category || p.categorySlug === query.category) &&
      (!query.q ||
        `${p.title} ${p.shortDescription} ${p.tags?.join(' ')}`
          .toLowerCase()
          .includes(query.q.trim().toLowerCase())),
  );
  return (
    <div className="site-container pb-20 pt-10 sm:pt-16">
      <div className="mb-9 max-w-2xl">
        <p className="eyebrow">Explore Crafting Corner</p>
        <h1 className="mt-4 font-display text-5xl font-normal sm:text-6xl">
          {type?.name || category?.title || 'The collection'}
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#746354]">
          Real pieces, photographed in our showroom. Explore the forms and
          finishes, then speak with us for a final quotation.
        </p>
      </div>
      <form
        action="/products"
        className="mb-6 grid gap-3 rounded-xl border border-[#ded3c5] bg-white/50 p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        {query.type ? (
          <input type="hidden" name="type" value={query.type} />
        ) : null}
        <label className="block text-xs text-[#746354]">
          Search the collection
          <input
            name="q"
            defaultValue={query.q || ''}
            type="search"
            placeholder="Search pieces or details"
            maxLength={150}
            className="mt-2 min-h-12 w-full rounded-lg border border-[#ded3c5] bg-white px-3 text-base text-charcoal"
          />
        </label>
        <label className="block text-xs text-[#746354]">
          Room
          <select
            name="category"
            defaultValue={query.category || ''}
            className="mt-2 min-h-12 w-full rounded-lg border border-[#ded3c5] bg-white px-3 text-base text-charcoal"
          >
            <option value="">All rooms</option>
            {categories
              .filter((c) => products.some((p) => p.categorySlug === c.slug))
              .map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
          </select>
        </label>
        <button type="submit" className="site-button self-end">
          Find pieces
        </button>
      </form>
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#746354]">
        <span>
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </span>
        {query.type || query.q || query.category ? (
          <Link href="/products" className="underline underline-offset-4">
            Clear filters
          </Link>
        ) : null}
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id || p.slug} {...p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#ded3c5] p-8 text-center sm:p-16">
          <h2 className="font-display text-3xl">
            Let’s find something for your space.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#746354]">
            There are no matching pieces in this selection. Explore the full
            collection or contact us about the piece you have in mind.
          </p>
          <Link href="/products" className="site-button mt-6">
            Explore all pieces
          </Link>
        </div>
      )}
    </div>
  );
}
