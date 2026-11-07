const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
