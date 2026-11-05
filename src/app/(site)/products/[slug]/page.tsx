/* --------------------------------------------------------------------------
   Product details page (server component)
--------------------------------------------------------------------------- */
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { readPublicContent } from "@/lib/adminContent.server";
import { pageMetadata, absoluteUrl, jsonLd, breadcrumbs } from "@/lib/seo";

import ProductView from "@/components/ProductView";
import {
  loadProducts,
  loadAllProducts,
  loadSiteData,
  type Product,
} from "@/lib/loaders.server";

/* ---------- static-site helpers ---------- */
export const dynamic = "force-dynamic";
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
    "/images/real/large/DSC00397.webp";

  return pageMetadata(
    `${product.title} | Crafting Corner`,
    product.shortDescription ||
      product.description ||
      `Explore ${product.title} at Crafting Corner.`,
    `/products/${product.slug}`,
    mainImg,
  );
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
      (p) => p.slug === slug && p.imageSource !== "real",
    );
    if (archived) redirect("/products");
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

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.description,
    image: product.images?.map((i) => absoluteUrl(i.url)),
    url: absoluteUrl(`/products/${product.slug}`),
    brand: { "@type": "Brand", name: site.brandName },
  };
  // This is an enquiry-led catalogue. Indicative prices are not confirmed offers.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Collection", path: "/products" },
              { name: product.title, path: `/products/${product.slug}` },
            ]),
          ),
        }}
      />
      <ProductView product={product} related={related} site={site} />
    </>
  );
}
