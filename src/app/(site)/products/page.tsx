import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { firstSearchParam, type SearchParam } from '@/lib/searchParams';
import { pageMetadata } from '@/lib/seo';
import {
  loadAllProducts,
  loadCategories,
  loadProductTypes,
} from '@/lib/loaders.server';
export const dynamic = 'force-dynamic';
type Props = {
  searchParams: Promise<{
    type?: SearchParam;
    category?: SearchParam;
    q?: SearchParam;
  }>;
};
export async function generateMetadata({ searchParams }: Props) {
  const { type, category, q } = await searchParams;
  return pageMetadata(
    'Furniture Collection in Mohali | Crafting Corner',
    'Browse furniture photographed in our Mohali showroom, from sculptural accent tables and chairs to bedside storage, consoles and writing desks.',
    '/products',
    undefined,
    [type, category, q].some((value) => Boolean(firstSearchParam(value))),
  );
}
export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = {
    type: firstSearchParam(params.type),
    category: firstSearchParam(params.category),
    q: firstSearchParam(params.q).slice(0, 150),
  };
  const term = query.q.toLowerCase();
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
      (!term ||
        `${p.title} ${p.shortDescription} ${p.tags?.join(' ')}`
          .toLowerCase()
          .includes(term)),
  );
  return (
    <div className="site-container pb-20 pt-10 sm:pt-16">
      <div className="site-enter mx-auto mb-9 max-w-2xl text-center">
        <p className="eyebrow">Explore Crafting Corner</p>
        <h1 className="mt-4 break-words text-balance font-display text-[clamp(2.5rem,6vw,3.75rem)] font-normal leading-[1.08]">
          {type?.name || category?.title || 'The collection'}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-7 text-[#746354]">
          Real pieces, photographed in our showroom. Explore the forms and
          finishes, then speak with us for a final quotation.
        </p>
      </div>
      <form
        key={JSON.stringify(query)}
        action="/products"
        role="search"
        aria-label="Furniture collection"
        className="mb-6 grid gap-4 rounded-xl border border-[#ded3c5] bg-white/50 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        {query.type ? (
          <input type="hidden" name="type" value={query.type} />
        ) : null}
        <label className="block text-xs text-[#746354]">
          Search the collection
          <input
            name="q"
            defaultValue={query.q}
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
            defaultValue={query.category}
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
      <div className="mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-[#746354] sm:justify-start">
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
