// src/app/[category]/page.tsx
// Highly–polished category landing page that’s fully statically-generated.
// It pulls its data from the JSON files in /src/data and sprinkles a few
// tasteful animations + a floating WhatsApp CTA.

import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import FloatingWhatsapp from "../../components/FloatingWhatsapp";
import ProductCard from "../../components/ProductCard";
import {
  allCategories,
  getCategory,
  loadProducts,
} from "../../lib/loaders.server";

// ────────────────────────────────────────────────────────────────────────────────
// Static-site helpers
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Pre-generate a page for every category in `/src/data/categories.json`.
 */
export const dynamicParams = false; // guarantees SSG
export async function generateStaticParams() {
  return allCategories.map((c) => ({ category: c.slug }));
}

/**
 * Set <title> and social meta for each category page.
 */
export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = getCategory(params.category);
  if (!cat) return {};

  return {
    title: `${cat.title} | Crafting Corner`,
    description: `Explore handcrafted ${cat.title.toLowerCase()} designed for Indian homes.`,
    openGraph: {
      images: [cat.image],
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// Page component
// ────────────────────────────────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const products = await loadProducts(cat.slug);

  return (
    <main className="pb-24">
      {/* Hero */}
      <section className="relative isolate mb-16 flex min-h-[40vh] items-center justify-center overflow-hidden rounded-b-3xl bg-walnut/5">
        {/* Backdrop */}
        <Image
          src={cat.image}
          alt={cat.title}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

        {/* Copy */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="font-display text-5xl font-semibold text-white drop-shadow-lg">
            {cat.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/90">
            Discover heirloom-quality pieces crafted to elevate modern Indian
            living spaces.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 px-4">
      {products.map((p) => (
  <ProductCard
    key={p.slug}
    {...p}
    img={Array.isArray(p.img) ? p.img[0] : p.img}
  />
))}
      </section>

      {/* WhatsApp floating action */}
      <FloatingWhatsapp
        phone="+919999999999"
        message={`Hi! I'm interested in ${cat.title}. Could you tell me more?`}
      />
    </main>
  );
}
