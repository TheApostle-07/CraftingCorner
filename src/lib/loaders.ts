// src/lib/loaders.ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import categories from '../data/categories.json';
import type { Category, Product } from './types';

// ─── categories helpers ────────────────────────────────────────────────────────
export const allCategories = categories as Category[];

export const getCategory = (slug: string) =>
  allCategories.find(c => c.slug === slug);

// ─── products loader (no more dynamic import) ─────────────────────────────────
export async function loadProducts(catSlug: string): Promise<Product[]> {
  const file = path.join(
    process.cwd(),
    'src', 'data', 'products',
    `${catSlug}.json`,
  );

  const json = await readFile(file, 'utf-8');
  return JSON.parse(json) as Product[];
}