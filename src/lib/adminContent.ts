import type {
  Category,
  HomepageData,
  Product,
  ProductType,
  SiteData,
  Testimonial,
} from './types';

export type AdminContent = {
  site: SiteData;
  homepage: HomepageData;
  categories: Category[];
  productTypes: ProductType[];
  products: Product[];
  testimonials: Testimonial[];
  seo: Record<string, unknown>;
  footer: Record<string, unknown>;
  navigation: Record<string, unknown>[];
};

export type ValidationIssue = {
  id: string;
  severity: 'error' | 'warning';
  area: string;
  message: string;
};

export type ContentHealth = {
  score: number;
  errors: number;
  warnings: number;
  issues: ValidationIssue[];
};

export const ADMIN_DATA_FILES = [
  'site.json',
  'homepage.json',
  'categories.json',
  'productTypes.json',
  'products.json',
  'testimonials.json',
  'seo.json',
  'footer.json',
  'navigation.json',
] as const;

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createId(prefix: string, value: string) {
  return `${prefix}_${createSlug(value).replace(/-/g, '_') || Date.now()}`;
}

function isValidImageUrl(url: string) {
  return url.startsWith('/') || url.startsWith('https://') || url.startsWith('http://');
}

function duplicateValues(values: string[]) {
  const seen = new Set<string>();
  const duplicateSet = new Set<string>();

  values.forEach((value) => {
    if (!value) return;
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  });

  return Array.from(duplicateSet);
}

function addIssue(
  issues: ValidationIssue[],
  severity: ValidationIssue['severity'],
  area: string,
  message: string,
) {
  issues.push({
    id: `${area}-${issues.length + 1}`,
    severity,
    area,
    message,
  });
}

export function validateAdminContent(content: AdminContent): ContentHealth {
  const issues: ValidationIssue[] = [];
  const categorySlugs = new Set(content.categories.map((category) => category.slug));
  const productTypeSlugs = new Set(content.productTypes.map((type) => type.slug));
  const productSlugs = new Set(content.products.map((product) => product.slug));

  duplicateValues(content.products.map((product) => product.slug)).forEach((slug) =>
    addIssue(issues, 'error', 'Products', `Duplicate product slug "${slug}".`),
  );
  duplicateValues(content.categories.map((category) => category.slug)).forEach((slug) =>
    addIssue(issues, 'error', 'Categories', `Duplicate category slug "${slug}".`),
  );
  duplicateValues(content.productTypes.map((type) => type.slug)).forEach((slug) =>
    addIssue(issues, 'error', 'Product Types', `Duplicate product type slug "${slug}".`),
  );

  content.products.forEach((product) => {
    const label = product.name || product.title || product.slug || 'Unnamed product';
    const images = product.images || [];

    if (!product.name && !product.title) {
      addIssue(issues, 'error', 'Products', 'A product is missing its name.');
    }
    if (!product.slug || product.slug !== createSlug(product.slug)) {
      addIssue(issues, 'error', 'Products', `${label} has an invalid slug.`);
    }
    if (!Number.isFinite(Number(product.price)) || Number(product.price) <= 0) {
      addIssue(issues, 'error', 'Products', `${label} is missing a valid price.`);
    }
    if (!product.categorySlug || !categorySlugs.has(product.categorySlug)) {
      addIssue(issues, 'error', 'Products', `${label} is not assigned to a valid category.`);
    }
    if (product.productTypeSlug && !productTypeSlugs.has(product.productTypeSlug)) {
      addIssue(issues, 'warning', 'Products', `${label} uses a deleted product type.`);
    }
    if (images.length === 0) {
      addIssue(issues, 'warning', 'Images', `${label} has no product image.`);
    }
    images.forEach((image) => {
      if (!image.alt?.trim()) {
        addIssue(issues, 'warning', 'Images', `${label} has an image without alt text.`);
      }
      if (image.url && !isValidImageUrl(image.url)) {
        addIssue(issues, 'warning', 'Images', `${label} has an invalid image URL.`);
      }
    });
    if (!product.shortDescription && !product.description) {
      addIssue(issues, 'warning', 'Products', `${label} is missing a description.`);
    }
    if (!product.seo?.title || !product.seo?.description) {
      addIssue(issues, 'warning', 'SEO', `${label} is missing SEO title or description.`);
    }
  });

  content.categories.forEach((category) => {
    const label = category.name || category.title || category.slug || 'Unnamed category';
    if (!category.slug || category.slug !== createSlug(category.slug)) {
      addIssue(issues, 'error', 'Categories', `${label} has an invalid slug.`);
    }
    if (!category.image) {
      addIssue(issues, 'warning', 'Categories', `${label} is missing a category image.`);
    }
    if (category.image && !isValidImageUrl(category.image)) {
      addIssue(issues, 'warning', 'Categories', `${label} has an invalid image URL.`);
    }
  });

  const homepageSections = [
    content.homepage.sections.bestSellers,
    content.homepage.sections.featured,
    content.homepage.sections.topPicks,
    content.homepage.sections.recommended,
  ];

  homepageSections.forEach((section) => {
    if (!section.visible) return;
    const missing = section.productSlugs.filter((slug) => !productSlugs.has(slug));
    if (missing.length > 0) {
      addIssue(
        issues,
        'error',
        'Homepage',
        `${section.heading} references deleted products: ${missing.join(', ')}.`,
      );
    }
    if (section.productSlugs.length > 0 && section.productSlugs.length < 3) {
      addIssue(
        issues,
        'warning',
        'Homepage',
        `${section.heading} has fewer than 3 selected products.`,
      );
    }
  });

  const whatsappNumber = content.site.whatsapp.number.replace(/\D/g, '');
  if (!/^[1-9]\d{9,14}$/.test(whatsappNumber)) {
    addIssue(issues, 'error', 'Settings', 'WhatsApp number is invalid.');
  }

  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;
  const score = Math.max(0, Math.min(100, 100 - errors * 12 - warnings * 3));

  return {
    score,
    errors,
    warnings,
    issues,
  };
}
