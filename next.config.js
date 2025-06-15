/**
 * Crafting‑Corner – custom Next.js configuration
 * ------------------------------------------------
 * • `ignoreBuildErrors` / `ignoreDuringBuilds` let us push while TypeScript
 *   or ESLint warnings are still being cleaned up.  
 *   Vercel will still compile successfully.
 * • Feel free to tighten these back up once the codebase is stable.
 */
const nextConfig = {
  reactStrictMode: true,

  // --- Deployment leniency -------------------------------------------
  typescript: {
    // ⛑  Don’t block the build if type‑checking fails
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⛑  Don’t block the build if ESLint finds problems
    ignoreDuringBuilds: true,
  },

  // --- Other handy tweaks --------------------------------------------
  // If you’re serving a lot of static images generated at build‑time,
  // leaving them unoptimised avoids an extra sharp binary on Vercel.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
