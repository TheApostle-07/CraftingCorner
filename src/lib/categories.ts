import categoriesData from '../data/categories.json';
import type { Category } from './types';

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

export const allCategories = (categoriesData as Category[])
  .map(normalizeCategory)
  .filter((category) => category.visibility !== 'draft')
  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

export const getCategory = (slug: string) =>
  allCategories.find((category) => category.slug === slug);
