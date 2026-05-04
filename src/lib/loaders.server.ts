/* --------------------------------------------------------------------------
   src/lib/loaders.server.ts
   Server helpers for reading category and product JSON safely in hosted builds.
--------------------------------------------------------------------------- */
import bedroomProducts from '../data/products/bedroom.json';
import customProducts from '../data/products/custom.json';
import diningRoomProducts from '../data/products/dining-room.json';
import kidsRoomProducts from '../data/products/kids-room.json';
import kitchenBarProducts from '../data/products/kitchen-bar.json';
import livingRoomProducts from '../data/products/living-room.json';
import officeProducts from '../data/products/office.json';
import outdoorProducts from '../data/products/outdoor.json';
import type { Product } from './types';
import { allCategories, getCategory } from './categories';

function withCategory(products: Product[], category: string): Product[] {
  return products.map((product) => ({
    ...product,
    category: product.category || category,
  }));
}

const categoryProductMap: Record<string, Product[]> = {
  bedroom: withCategory(bedroomProducts as Product[], 'bedroom'),
  custom: withCategory(customProducts as Product[], 'custom'),
  'dining-room': withCategory(diningRoomProducts as Product[], 'dining-room'),
  'kids-room': withCategory(kidsRoomProducts as Product[], 'kids-room'),
  'kitchen-bar': withCategory(kitchenBarProducts as Product[], 'kitchen-bar'),
  'living-room': withCategory(livingRoomProducts as Product[], 'living-room'),
  office: withCategory(officeProducts as Product[], 'office'),
  outdoor: withCategory(outdoorProducts as Product[], 'outdoor'),
};

function dedupeProducts(products: Product[]): Product[] {
  return Array.from(
    new Map(products.map((product) => [product.slug, product])).values(),
  );
}

/** Read `/src/data/products/<category>.json` with bundled-data fallback. */
export async function loadProducts(catSlug: string): Promise<Product[]> {
  const bundledProducts = categoryProductMap[catSlug];
  if (bundledProducts?.length) {
    return bundledProducts;
  }

  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const file = join(process.cwd(), 'src', 'data', 'products', `${catSlug}.json`);
    const json = await readFile(file, 'utf8');

    if (json.trim()) {
      return withCategory(JSON.parse(json) as Product[], catSlug);
    }
  } catch (err) {
    console.error(`[loadProducts] Failed to load category "${catSlug}":`, err);
  }

  const fallbackProducts = await loadAllProducts();
  return fallbackProducts.filter((product) => product.category === catSlug);
}

/** Read the master list at `/src/data/products.json` and flatten it. */
export async function loadAllProducts(): Promise<Product[]> {
  const categoryProducts = dedupeProducts(
    Object.values(categoryProductMap).flat(),
  );
  if (categoryProducts.length) {
    return categoryProducts;
  }

  try {
    const mod = (await import('../data/products.json')) as { default: unknown };
    const raw = mod.default as unknown;

    if (Array.isArray(raw)) {
      return dedupeProducts(raw as Product[]);
    }

    return dedupeProducts(
      Object.values(raw as Record<string, Product[]>).flat() as Product[],
    );
  } catch {
    /* fall through to fs */
  }

  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const file = join(process.cwd(), 'src', 'data', 'products.json');
    const json = await readFile(file, 'utf8');

    if (!json.trim()) {
      return [];
    }

    const raw = JSON.parse(json) as Product[] | Record<string, Product[]>;
    return dedupeProducts(
      Array.isArray(raw) ? raw : Object.values(raw).flat(),
    );
  } catch (err) {
    console.error('[loadAllProducts] Failed to load products:', err);
    return [];
  }
}

export { allCategories, getCategory };
export type { Product };
