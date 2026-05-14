import { readPublicContent } from './adminContent.server';
import type { Category, Product, ProductImage, ProductType, SiteData } from './types';

function normalizeImages(product: Product): ProductImage[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  const imageUrls = Array.isArray(product.img) ? product.img : [product.img].filter(Boolean);

  return imageUrls.map((url, index) => ({
    url: url || '',
    alt:
      index === 0
        ? product.title || product.name || 'Product image'
        : `${product.title || product.name} view ${index + 1}`,
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

export async function loadCategories(): Promise<Category[]> {
  const content = await readPublicContent();

  return content.categories
    .map(normalizeCategory)
    .filter((category) => category.visibility !== 'draft')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function getCategory(slug: string) {
  const categories = await loadCategories();
  return categories.find((category) => category.slug === slug);
}

export async function loadAllProducts(): Promise<Product[]> {
  const content = await readPublicContent();

  return content.products
    .map(normalizeProduct)
    .filter((product) => product.visibility !== 'draft')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function loadProducts(catSlug: string): Promise<Product[]> {
  const products = await loadAllProducts();
  return products.filter((product) => product.categorySlug === catSlug);
}

export async function loadProductTypes(): Promise<ProductType[]> {
  const content = await readPublicContent();

  return content.productTypes
    .filter((type) => type.visibility !== 'draft')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function loadSiteData(): Promise<SiteData> {
  const content = await readPublicContent();
  return content.site;
}

export async function loadFooterData() {
  const content = await readPublicContent();
  return content.footer;
}

export type { Product };
