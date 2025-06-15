import type { Product } from './types';
import { getCategory, allCategories } from './categories';

/**
 * Read `/src/data/products/<category>.json` directly from disk.
 * NOTE: this file ends with `.server.ts`, so Next.js + Turbopack
 *       will include it **only** in the server bundle.
 */
export async function loadProducts(catSlug: string): Promise<Product[]> {
  const { readFile } = await import('node:fs/promises');
  const { join }     = await import('node:path');

  const file = join(process.cwd(), 'src', 'data', 'products', `${catSlug}.json`);

  try {
    const json = await readFile(file, 'utf8');
    if (json.trim() === '') {
      console.warn(`[loadProducts] "${file}" is empty – returning []`);
      return [];
    }
    return JSON.parse(json) as Product[];
  } catch (err) {
    console.error(`[loadProducts] Failed to load or parse "${file}":`, err);
    return [];
  }
}

// Re-export so other server files can do
//   import { loadProducts, allCategories } from '@/lib/loaders.server';
export { allCategories, getCategory };
export type { Product };