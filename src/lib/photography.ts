import photography from '@/data/realPhotography.json';
import type { AdminContent } from './adminContent';
import type { Product, ProductType } from './types';

export const realPhoto = (name: string, size: 'large' | 'small' = 'large') =>
  `/images/real/${size}/${name}.webp`;

export const realProducts = photography.products as Product[];

// A versioned, reversible rollout also works against a previously seeded Neon CMS.
// Once saved in admin, subsequent edits are read unchanged from the content store.
export function preparePhotographyContent(content: AdminContent): AdminContent {
  if (content.site.photographyVersion === photography.version) return content;
  const categoryPhotos = {
    'living-room': 'DSC00087',
    bedroom: 'DSC00097',
    office: 'DSC00118',
    custom: 'DSC00374',
  };
  const types: ProductType[] = [
    {
      id: 'type_side_tables',
      slug: 'side-tables',
      name: 'Accent Tables',
      image: realPhoto('DSC09413'),
      visibility: 'published',
      sortOrder: 1,
    },
    {
      id: 'type_chairs',
      slug: 'chairs',
      name: 'Chairs & Stools',
      image: realPhoto('DSC00344'),
      visibility: 'published',
      sortOrder: 2,
    },
    {
      id: 'type_console',
      slug: 'console',
      name: 'Consoles & Vanities',
      image: realPhoto('DSC02250'),
      visibility: 'published',
      sortOrder: 3,
    },
    {
      id: 'type_display',
      slug: 'display-storage',
      name: 'Display & Storage',
      image: realPhoto('DSC02274'),
      visibility: 'published',
      sortOrder: 4,
    },
    {
      id: 'type_desks',
      slug: 'desks',
      name: 'Writing Desks',
      image: realPhoto('DSC00118'),
      visibility: 'published',
      sortOrder: 5,
    },
  ];
  const shelf = (heading: string, indices: number[]) => ({
    visible: true,
    heading,
    productSlugs: indices.map((i) => realProducts[i].slug),
  });
  return {
    ...content,
    site: { ...content.site, photographyVersion: photography.version },
    products: [
      ...content.products
        .filter(
          (p) =>
            !realProducts.some(
              (real) => real.id === p.id || real.slug === p.slug,
            ),
        )
        .map((p) => ({ ...p, visibility: 'draft' as const })),
      ...realProducts,
    ],
    categories: content.categories.map((category) => ({
      ...category,
      visibility:
        category.slug in categoryPhotos
          ? ('published' as const)
          : ('draft' as const),
      image:
        category.slug in categoryPhotos
          ? realPhoto(
              categoryPhotos[category.slug as keyof typeof categoryPhotos],
            )
          : category.image,
      subtitle:
        category.slug === 'custom'
          ? 'A closer look at the shapes, finishes and details that make a room your own.'
          : 'Explore pieces and room inspiration photographed at Crafting Corner.',
      subs: [],
    })),
    productTypes: [
      ...types,
      ...content.productTypes
        .filter((t) => !types.some((next) => next.slug === t.slug))
        .map((t) => ({ ...t, visibility: 'draft' as const })),
    ],
    homepage: {
      ...content.homepage,
      hero: {
        ...content.homepage.hero,
        title: 'A little character.\nA home like no other.',
        subtitle:
          'Considered furniture, expressive details and room to make it yours. Explore our collection, photographed in our Mohali showroom.',
        backgroundImage: realPhoto('DSC00397'),
      },
      sections: {
        ...content.homepage.sections,
        browseCategories: {
          visible: true,
          heading: 'Find your corner',
          categoryOrder: ['living-room', 'bedroom', 'office', 'custom'],
        },
        browseProducts: {
          visible: true,
          heading: 'Considered, down to the detail',
          productTypeOrder: types.map((t) => t.slug),
        },
        bestSellers: shelf('Pieces with presence', [0, 1, 8]),
        featured: shelf('The art of the accent', [5, 6, 14]),
        topPicks: shelf('A seat of your own', [7, 9, 3]),
        recommended: shelf('Everyday, thoughtfully composed', [10, 11, 12]),
        testimonials: {
          ...content.homepage.sections.testimonials,
          visible: false,
        },
      },
    },
  };
}
