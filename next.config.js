const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingIncludes: { "/*": ["./migrations/*.sql"] },
  // Photography is delivered in two already optimized WebP sizes.
  images: { unoptimized: true },
};
export default nextConfig;
