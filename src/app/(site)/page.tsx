import HomeClient from "@/components/HomeClient";
import { Suspense } from "react";
import HomeJournal from "@/components/blog/HomeJournal";
import { absoluteUrl, homeDescription, homeTitle, jsonLd, pageMetadata } from "@/lib/seo";
import { readPublicContent } from "@/lib/adminContent.server";
import {
  loadAllProducts,
  loadCategories,
  loadProductTypes,
} from "@/lib/loaders.server";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(homeTitle, homeDescription, "/");

export default async function HomePage() {
  const [content, products, categories, productTypes] = await Promise.all([
    readPublicContent(),
    loadAllProducts(),
    loadCategories(),
    loadProductTypes(),
  ]);

  const testimonials = content.homepage.sections.testimonials.visible
    ? content.testimonials
        .filter((testimonial) => testimonial.visibility !== "draft")
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const { site } = content;
  const businessId = absoluteUrl("/#organization");
  const socialProfiles = Object.values(site.social).filter((url) =>
    url?.startsWith("https://"),
  );
  const location = site.contact.address.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: site.brandName,
                url: absoluteUrl("/"),
                inLanguage: "en-IN",
                publisher: { "@id": businessId },
              },
              {
                "@type": "FurnitureStore",
                "@id": businessId,
                name: site.brandName,
                url: absoluteUrl("/"),
                description: homeDescription,
                telephone: site.contact.phone,
                email: site.contact.email,
                address: location === "Mohali, Punjab, India"
                  ? {
                      "@type": "PostalAddress",
                      addressLocality: "Mohali",
                      addressRegion: "Punjab",
                      addressCountry: "IN",
                    }
                  : location || undefined,
                logo: site.logoImage ? absoluteUrl(site.logoImage) : undefined,
                sameAs: socialProfiles.length ? socialProfiles : undefined,
              },
            ],
          }),
        }}
      />
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
