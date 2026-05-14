import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';
import type { Category, Product, ProductImage } from './types';

function normalizeImages(product: Product): ProductImage[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  const imageUrls = Array.isArray(product.img) ? product.img : [product.img].filter(Boolean);

  return imageUrls.map((url, index) => ({
    url: url || '',
    alt: index === 0 ? product.title || product.name || 'Product image' : `${product.title || product.name} view ${index + 1}`,
    isPrimary: index === 0,
  }));
}

function normalizeProduct(product: Product): Product {
  const title = product.title || product.name || '';
  const category = product.categorySlug || product.category || '';
  const images = normalizeImages({ ...product, title });
  const img = images.length > 1 ? images.map((image) => image.url) : images[0]?.url || '';

  return {
    ...product,
    name: product.name || title,
    title,
    category,
    categorySlug: category,
    images,
    img,
    shortDescription: product.shortDescription || product.description || '',
    description: product.description || product.shortDescription || '',
    tags: product.tags || [],
    sections: product.sections || {},
    visibility: product.visibility || 'published',
    sortOrder: product.sortOrder || 0,
  };
}

function normalizeCategory(category: Category, index: number): Category {
  const title = category.title || category.name || '';

  return {
    ...category,
    id: category.id || `cat_${category.slug.replace(/[^a-z0-9]+/gi, '_')}`,
    name: category.name || title,
    title,
    subtitle:
      category.subtitle ||
      `Explore handcrafted ${title.toLowerCase()} designed for Indian homes.`,
    alt: category.alt || `${title} category image`,
    visibility: category.visibility || 'published',
    sortOrder: category.sortOrder || index + 1,
  };
}

function flattenProducts(raw: unknown): Product[] {
  if (Array.isArray(raw)) {
    return raw as Product[];
  }

  return Object.values(raw as Record<string, Product[]>).flat();
}

function publishedProduct(product: Product) {
  return product.visibility !== 'draft';
}

function publishedCategory(category: Category) {
  return category.visibility !== 'draft';
}

export const allCategories = (categoriesData as Category[])
  .map(normalizeCategory)
  .filter(publishedCategory)
  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

const allProducts = flattenProducts(productsData)
  .map(normalizeProduct)
  .filter(publishedProduct)
  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

export const getCategory = (slug: string) =>
  allCategories.find((category) => category.slug === slug);

export async function loadProducts(catSlug: string): Promise<Product[]> {
  return allProducts.filter((product) => product.categorySlug === catSlug);
}

export async function loadAllProducts(): Promise<Product[]> {
  return allProducts;
}

export type { Product };
