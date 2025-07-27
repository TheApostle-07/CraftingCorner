/* --------------------------------------------------------------------------
   src/lib/loaders.server.ts           (server-only)
   Helpers for reading product JSON directly from disk
--------------------------------------------------------------------------- */
import type { Product } from './types';
import { getCategory, allCategories } from './categories';

/** Read `/src/data/products/<category>.json` */
export async function loadProducts(catSlug: string): Promise<Product[]> {
  const { readFile } = await import('node:fs/promises');
  const { join }     = await import('node:path');

  const file = join(process.cwd(), 'src', 'data', 'products', `${catSlug}.json`);

  try {
    const json = await readFile(file, 'utf8');
    if (json.trim() === '') return [];
    return JSON.parse(json) as Product[];
  } catch (err) {
    console.error(`[loadProducts] Failed to read "${file}":`, err);
    return [];
  }
}

/** Read the master list at `/src/data/products.json`
 *  1.  In production (Vercel), the JSON is bundled by Next.js so we can
 *      `import` it directly.
 *  2.  Locally we fall back to an explicit fs read so hot‑reloading still works.
 */
export async function loadAllProducts(): Promise<Product[]> {
  // ── 1. Try the bundled import (works in serverless/edge) ─────────────
  try {
    /** `import()` returns the *bundled* JSON.
     *    • In dev this is an object with a `default` key.
     *    • In prod (after next‑json-loader optimisations) it can be either
     *      an array of products **or** the productTypes map depending on
     *      what was bundled.
     *  We normalise everything to a flat Product[] here. */
    const mod = (await import('../data/products.json')) as { default: unknown };
    const raw = mod.default as unknown;

    const arr: Product[] = Array.isArray(raw)
      ? (raw as Product[])
      : (Object.values(raw as Record<string, Product[]>).flat() as Product[]);

    return arr;
  } catch {
    /* no‑op – fall through to fs */
  }

  // ── 2. Fallback: read from disk (local dev) ──────────────────────────
  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const file = join(process.cwd(), 'src', 'data', 'products.json');

    const json = await readFile(file, 'utf8');
    return json.trim() ? (JSON.parse(json) as Product[]) : [];
  } catch (err) {
    console.error('[loadAllProducts] Failed to load products:', err);
    return [];
  }
}

// Re-export helpers/types
export { allCategories, getCategory };
export type { Product };
