/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductView from '@/components/ProductView';
import {
  allCategories,
  loadProducts,
  loadAllProducts,
  type Product,
} from '@/lib/loaders.server';

/* ---------- static-site helpers ---------- */
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  for (const cat of allCategories) {
    const products = await loadProducts(cat.slug);
    products.forEach((product) => {
      if (!params.some((item) => item.slug === product.slug)) {
        params.push({ slug: product.slug });
      }
    });
  }

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

  return <ProductView product={product} related={related} />;
}
