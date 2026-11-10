import type { MetadataRoute } from "next";
import { retiredProductPaths } from "@/data/retired-product-paths";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      {
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/api/", ...retiredProductPaths.map((path) => `${path}$`)],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
