import bedroomProducts from '../data/products/bedroom.json';
import categories from '../data/categories.json';
import customProducts from '../data/products/custom.json';
import diningRoomProducts from '../data/products/dining-room.json';
import kidsRoomProducts from '../data/products/kids-room.json';
import kitchenBarProducts from '../data/products/kitchen-bar.json';
import livingRoomProducts from '../data/products/living-room.json';
import officeProducts from '../data/products/office.json';
import outdoorProducts from '../data/products/outdoor.json';
import type { Category, Product } from './types';

export const allCategories = categories as Category[];

export const getCategory = (slug: string) =>
  allCategories.find((category) => category.slug === slug);

const categoryProductMap: Record<string, Product[]> = {
  bedroom: (bedroomProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'bedroom',
  })),
  custom: (customProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'custom',
  })),
  'dining-room': (diningRoomProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'dining-room',
  })),
  'kids-room': (kidsRoomProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'kids-room',
  })),
  'kitchen-bar': (kitchenBarProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'kitchen-bar',
  })),
  'living-room': (livingRoomProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'living-room',
  })),
  office: (officeProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'office',
  })),
  outdoor: (outdoorProducts as Product[]).map((product) => ({
    ...product,
    category: product.category || 'outdoor',
  })),
};

export async function loadProducts(catSlug: string): Promise<Product[]> {
  return categoryProductMap[catSlug] || [];
}
