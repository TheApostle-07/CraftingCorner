// src/app/[category]/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import FloatingWhatsapp from '../../../components/FloatingWhatsapp';
import ProductCard from '../../../components/ProductCard'; // for related items

import {
  allCategories,
  getCategory,
  loadProducts,
} from '../../../lib/loaders.server';

// ───────────────────────────────────────────────────────────────────────────────
// Static-site helpers
// ───────────────────────────────────────────────────────────────────────────────

// Generate a page for *every* product in every category.
export const dynamicParams = false;
export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];

  for (const cat of allCategories) {
    const products = await loadProducts(cat.slug);
    for (const p of products) {
      params.push({ category: cat.slug, slug: p.slug });
    }
  }

  return params;
}

// Per-page <title>, description, OG image, etc.
export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const cat = getCategory(params.category);
  if (!cat) return {};

  const product = (await loadProducts(cat.slug)).find(
    (p) => p.slug === params.slug,
  );
  if (!product) return {};

  const mainImg =
    typeof product.img === 'string' ? product.img : product.img[0];

  return {
    title: `${product.title} | Crafting Corner`,
    description: product.description || `Premium ${product.title} made for Indian homes.`,
    openGraph: {
      images: [mainImg],
    },
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Page component
// ───────────────────────────────────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const products = await loadProducts(cat.slug);
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // Make img always an array for convenience
  const gallery = Array.isArray(product.img) ? product.img : [product.img];

  // Pick three “related” products (just the first three others in that category).
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <main className="pb-32">
        {/* ——— Hero / gallery ——— */}
        <section className="relative mx-auto mb-12 grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
          {/* Main Image */}
          <div className="overflow-hidden rounded-2xl bg-walnut/5">
            <Image
              src={gallery[0]}
              alt={product.title}
              width={900}
              height={700}
              className="h-full w-full object-cover object-center"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="font-display text-4xl font-semibold text-ivory">
              {product.title}
            </h1>

            <span className="inline-block w-max rounded-full bg-walnut/10 px-4 py-1.5 font-medium tracking-wide text-walnut">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.description && (
              <p className="leading-relaxed text-ivory/90">
                {product.description}
              </p>
            )}

            {product.tags?.length && (
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded bg-charcoal/5 px-3 py-1 text-sm text-charcoal/80"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ——— Secondary gallery thumbnails (if more images) ——— */}
        {gallery.length > 1 && (
          <section className="mx-auto mb-20 grid max-w-5xl grid-cols-2 gap-4 px-4 md:grid-cols-3">
            {gallery.slice(1).map((img, i) => (
              <div
                key={img}
                className="overflow-hidden rounded-xl bg-walnut/5"
              >
                <Image
                  src={img}
                  alt={`${product.title} alternate view ${i + 1}`}
                  width={600}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </section>
        )}

        {/* ——— Related products ——— */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4">
            <h2 className="mb-6 font-display text-2xl font-semibold text-walnut">
              You may also like
            </h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8">
              {related.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* ——— WhatsApp CTA ——— */}
        <FloatingWhatsapp
          phone="+919999999999"
          message={`Hi! I'm interested in the ${product.title}. Could you tell me more?`}
        />
      </main>
    </>
  );
}
