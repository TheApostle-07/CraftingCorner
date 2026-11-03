/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { readPublicContent } from '@/lib/adminContent.server';

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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return {};

  const mainImg =
    (Array.isArray(product.img) ? product.img[0] : product.img) ||
    '/images/real/large/DSC00397.webp';

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) {
    const content = await readPublicContent();
    const archived = content.products.find(
      (p) => p.slug === slug && p.imageSource !== 'real',
    );
    if (archived) redirect('/products');
    notFound();
  }

  let related: Product[] = [];

  if (product.category) {
    related = (await loadProducts(product.category)).filter(
      (p) => p.slug !== product.slug,
    );
  } else {
    const globalList = await loadAllProducts();
    related = globalList.filter((p) => p.slug !== product.slug);
  }

  related = related.slice(0, 3);
  const site = await loadSiteData();

  return <ProductView product={product} related={related} site={site} />;
}
