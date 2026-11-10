import { retiredProductPaths } from "./src/data/retired-product-paths.js";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // Keep the existing redirect for legacy links without rendering a product
    // page for the backlink crawler while it refreshes its robots policy.
    return retiredProductPaths.map((source) => ({
      source,
      destination: "/products",
      permanent: false,
      has: [{ type: "header", key: "user-agent", value: ".*\\bAhrefsBot/.*" }],
    }));
  },
  async headers() {
    const headers = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return ["/admin/:path*", "/api/:path*", "/blog/feed.xml"].map((source) => ({
      source,
      headers,
    }));
  },
  outputFileTracingIncludes: { "/*": ["./migrations/*.sql"] },
  // Photography is delivered in two already optimized WebP sizes.
  images: { unoptimized: true },
};
export default nextConfig;
