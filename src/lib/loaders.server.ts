// src/lib/loaders.server.ts
// ————————————————————
// Fully static data helpers — compatible with output: "export"
// ————————————————————
//  ▸ No more fs / path → everything is pulled from the JSON bundle
//  ▸ Works both in local dev (Node server) and on Vercel’s CDN build
// ————————————————————

import type { Product } from ‘./types’;
import { allCategories, getCategory } from ‘./categories’;

// Master list – tree-shaken into the JS bundle at build-time
import master from ‘../data/products.json’;

const allProducts = master as Product[];

/* ————————————————————————
Return all products (used by /products page & slug fallback)
———————————————————————— */
export async function loadAllProducts(): Promise<Product[]> {
return allProducts;
}

/* ————————————————————————
Filter by category slug (re-used by category/[slug] routes)
———————————————————————— */
export async function loadProducts(catSlug: string): Promise<Product[]> {
const slug = catSlug.toLowerCase();
return allProducts.filter(
(p) => p.category?.toLowerCase() === slug,
);
}

// Re-export helpers so callers can do
//   import { loadProducts, allCategories } from ‘@/lib/loaders.server’;
export { allCategories, getCategory };
export type { Product };
