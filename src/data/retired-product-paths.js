import legacyProducts from "./products.json" with { type: "json" };
import photography from "./realPhotography.json" with { type: "json" };

const showroomSlugs = new Set(photography.products.map(({ slug }) => slug));

export const retiredProductPaths = legacyProducts
  .filter(({ slug }) => !showroomSlugs.has(slug))
  .map(({ slug }) => `/products/${slug}`);
