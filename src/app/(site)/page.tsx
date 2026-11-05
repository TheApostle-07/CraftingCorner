import HomeClient from "@/components/HomeClient";
import { Suspense } from "react";
import HomeJournal from "@/components/blog/HomeJournal";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Crafting Corner | Furniture & Living in Mohali",
  "Explore the Crafting Corner showroom collection: expressive furniture, considered details and personal guidance for your space.",
  "/",
);
import { readPublicContent } from "@/lib/adminContent.server";
import {
  loadAllProducts,
  loadCategories,
  loadProductTypes,
} from "@/lib/loaders.server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, products, categories, productTypes] = await Promise.all([
    readPublicContent(),
    loadAllProducts(),
    loadCategories(),
    loadProductTypes(),
  ]);

  const testimonials = content.testimonials
    .filter((testimonial) => testimonial.visibility !== "draft")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <HomeClient
        homepage={content.homepage}
        products={products}
        productTypes={productTypes}
        testimonials={testimonials}
        categories={categories}
      />
      <Suspense fallback={null}>
        <HomeJournal />
      </Suspense>
    </>
  );
}
