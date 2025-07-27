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

/** Read the master list at `/src/data/products.json` */
export async function loadAllProducts(): Promise<Product[]> {
  const { readFile } = await import('node:fs/promises');
  const { join }     = await import('node:path');

  const file = join(process.cwd(), 'src', 'data', 'products.json');

  try {
    const json = await readFile(file, 'utf8');
    if (json.trim() === '') return [];
    return JSON.parse(json) as Product[];
  } catch (err) {
    console.error(`[loadAllProducts] Failed to read "${file}":`, err);
    return [];
  }
}

// Re-export helpers/types
export { allCategories, getCategory };
export type { Product };
