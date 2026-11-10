import type { MetadataRoute } from "next";
import legacyProducts from "@/data/products.json";
import photography from "@/data/realPhotography.json";
import { absoluteUrl } from "@/lib/seo";

// Skip the pre-rollout catalogue during backlink crawls. Its redirects stay public.
const showroomSlugs = new Set(photography.products.map(({ slug }) => slug));
const retiredProductPaths = legacyProducts
  .filter(({ slug }) => !showroomSlugs.has(slug))
  .map(({ slug }) => `/products/${slug}$`);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      {
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/api/", ...retiredProductPaths],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
