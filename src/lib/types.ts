// src/lib/types.ts
/** Optional nested sub-category */
export interface SubCategory {
    slug: string;
    title: string;
    image: string;
  }
  
  /** Top-level category displayed in the nav */
  export interface Category {
    /** URL slug, e.g. “living-room” */
    slug: string;
    /** Display label shown to users */
    title: string;           // ← was “name” before
    /** Path to an icon SVG / image (optional) */
    icon?: string;
    /** Hero / banner image */
    image: string;
    /** Nested sections (optional) */
    subs?: SubCategory[];
  }
  
  /** Individual product card / page */
  export interface Product {
    slug: string;
    title: string;
    price: number;           // stored in paise / cents
    img: string | string[];
    category: string;        // parent *category* slug
    description?: string;
    tags?: string[];
  }