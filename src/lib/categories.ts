import categories from '../data/categories.json';
import type { Category } from './types';

export const allCategories = categories as Category[];

export const getCategory = (slug: string) =>
  allCategories.find(c => c.slug === slug);