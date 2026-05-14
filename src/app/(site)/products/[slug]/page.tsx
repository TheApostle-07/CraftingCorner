/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductView from '@/components/ProductView';
import {
  loadProducts,
  loadAllProducts,
  loadSiteData,
  type Product,
} from '@/lib/loaders.server';

/* ---------- static-site helpers ---------- */
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await findProduct(params.slug);
  if (!product) return {};

  const mainImg =
    (Array.isArray(product.img) ? product.img[0] : product.img) ||
    '/assets/img/products/bestseller_1.png';

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
  const products = await loadAllProducts();
  return products.find((product) => product.slug === slug) ?? null;
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
    related = (
      await loadProducts(product.category)
    ).filter((p) => p.slug !== product.slug);
  } else {
    const globalList = await loadAllProducts();
    related = globalList.filter((p) => p.slug !== product.slug);
  }

  related = related.slice(0, 3);
  const site = await loadSiteData();

  return <ProductView product={product} related={related} site={site} />;
}
