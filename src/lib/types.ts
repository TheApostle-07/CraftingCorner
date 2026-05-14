export type Visibility = 'published' | 'draft';

export type StockStatus = 'available' | 'made-to-order' | 'out-of-stock';

export interface SeoFields {
  title: string;
  description: string;
}

export interface SubCategory {
  slug: string;
  title: string;
  image: string;
}

export interface Category {
  id?: string;
  slug: string;
  name?: string;
  title: string;
  subtitle?: string;
  image: string;
  alt?: string;
  icon?: string;
  visibility?: Visibility;
  sortOrder?: number;
  seo?: SeoFields;
  subs?: SubCategory[];
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductSections {
  bestSeller?: boolean;
  featured?: boolean;
  topPick?: boolean;
  recommended?: boolean;
}

export interface Product {
  id?: string;
  slug: string;
  name?: string;
  title: string;
  category?: string;
  categorySlug?: string;
  productTypeSlug?: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription?: string;
  description?: string;
  img?: string | string[];
  images?: ProductImage[];
  tags?: string[];
  sections?: ProductSections;
  visibility?: Visibility;
  stockStatus?: StockStatus;
  material?: string;
  dimensions?: string;
  finish?: string;
  careInstructions?: string;
  seo?: SeoFields;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductType {
  id: string;
  slug: string;
  name: string;
  image: string;
  visibility: Visibility;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  projectType: string;
  location: string;
  quote: string;
  visibility: Visibility;
  sortOrder: number;
}

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    logoImage?: string;
    ctaText?: string;
    scrollLabel?: string;
  };
  sections: {
    browseCategories: {
      visible: boolean;
      heading: string;
      categoryOrder: string[];
    };
    browseProducts: {
      visible: boolean;
      heading: string;
      productTypeOrder: string[];
    };
    bestSellers: {
      visible: boolean;
      heading: string;
      productSlugs: string[];
    };
    featured: {
      visible: boolean;
      heading: string;
      productSlugs: string[];
    };
    topPicks: {
      visible: boolean;
      heading: string;
      productSlugs: string[];
    };
    recommended: {
      visible: boolean;
      heading: string;
      productSlugs: string[];
    };
    testimonials: {
      visible: boolean;
      heading: string;
      subheading: string;
    };
  };
  updatedAt?: string;
}

export interface SiteData {
  brandName: string;
  logoText?: string;
  logoImage?: string;
  whatsapp: {
    number: string;
    enabled: boolean;
    defaultMessage: string;
    productMessageTemplate: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  updatedAt?: string;
}
