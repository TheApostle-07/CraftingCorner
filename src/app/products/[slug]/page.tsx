/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductView from '../../../components/ProductView';
import {
  allCategories,
  loadProducts,
  loadAllProducts,
  type Product,
} from '../../../lib/loaders.server';

/* ---------- static-site helpers ---------- */
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // 1. Slugs from category‑specific JSON files
  for (const cat of allCategories) {
    const products = await loadProducts(cat.slug);
    products.forEach((p) => params.push({ slug: p.slug }));
  }

  // 2. Slugs from the master products.json (for bespoke / uncategorised)
  const allRaw = await loadAllProducts();
  // loadAllProducts may return an array OR a map – normalise to a flat array
  const allList: Product[] = Array.isArray(allRaw)
    ? (allRaw as Product[])
    : (Object.values(allRaw).flat() as Product[]);

  allList.forEach((p) => {
    if (!params.some((x) => x.slug === p.slug)) {
      params.push({ slug: p.slug });
    }
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await findProduct(params.slug);
  if (!product) return {};

  const mainImg = Array.isArray(product.img) ? product.img[0] : product.img;

  return {
    title: `${product.title} | Crafting Corner`,
    description:
      product.description ??
      `Premium ${product.title} crafted for modern Indian homes.`,
    openGraph: { images: [mainImg] },
  };
}

/* ---------- helpers ---------- */
async function findProduct(slug: string): Promise<Product | null> {
  // First search inside category files
  for (const cat of allCategories) {
    const products = await loadProducts(cat.slug);
    const found = products.find((p) => p.slug === slug);
    if (found) return found;
  }

  // Fallback: search the master products.json
  const allRaw = await loadAllProducts();
  const allList: Product[] = Array.isArray(allRaw)
    ? (allRaw as Product[])
    : (Object.values(allRaw).flat() as Product[]);

  return allList.find((p) => p.slug === slug) ?? null;
}

/* ---------- page ---------- */
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await findProduct(params.slug);
  if (!product) notFound();

  let related: Product[] = [];

  if (product.category) {
    // If we know the category, pull related from that category file
    related = (
      await loadProducts(product.category)
    ).filter((p) => p.slug !== product.slug);
  } else {
    // Otherwise use the global list as a fallback
    const globalList = await loadAllProducts();
    related = (Array.isArray(globalList)
      ? (globalList as Product[])
      : (Object.values(globalList).flat() as Product[])
    ).filter((p) => p.slug !== product.slug);
  }

  related = related.slice(0, 3);

  return <ProductView product={product} related={related} />;
}
