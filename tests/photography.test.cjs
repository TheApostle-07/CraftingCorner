const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.join(__dirname, "..");
const moduleCache = new Map();
function readModule(file) {
  if (moduleCache.has(file)) return moduleCache.get(file);
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return require(name);
    let target = name.startsWith("@/")
      ? path.join(root, "src", name.slice(2))
      : path.resolve(path.dirname(file), name);
    if (!path.extname(target)) target += ".ts";
    return readModule(target);
  };
  new Function("require", "module", "exports", source)(
    localRequire,
    module,
    module.exports,
  );
  moduleCache.set(file, module.exports);
  return module.exports;
}
const { preparePhotographyContent } = readModule(
  path.join(root, "src/lib/photography.ts"),
);
const { validateAdminContent } = readModule(
  path.join(root, "src/lib/adminContent.ts"),
);
const { productPrice, enquiryHref } = readModule(
  path.join(root, "src/lib/productPresentation.ts"),
);
const content = Object.fromEntries(
  [
    "site",
    "homepage",
    "categories",
    "productTypes",
    "products",
    "testimonials",
    "seo",
    "footer",
    "navigation",
  ].map((key) => [
    key,
    JSON.parse(
      fs.readFileSync(path.join(root, `src/data/${key}.json`), "utf8"),
    ),
  ]),
);
const snapshot = JSON.stringify(content);
const migrated = preparePhotographyContent(content);
const publicProducts = migrated.products.filter(
  (p) => p.visibility === "published",
);

test("rollout preserves original records and prices, while publishing real enquiry products", () => {
  assert.equal(JSON.stringify(content), snapshot);
  assert.equal(publicProducts.length, 15);
  assert.equal(migrated.products.length, content.products.length + 15);
  for (const old of content.products) {
    const archived = migrated.products.find((p) => p.id === old.id);
    assert.equal(archived.price, old.price);
    assert.equal(archived.slug, old.slug);
    assert.deepEqual(archived.images, old.images);
    assert.equal(archived.visibility, "draft");
  }
});
test("estimates never become confirmed commerce prices, discounts or available stock", () => {
  for (const p of publicProducts) {
    assert.equal(p.price, 0);
    assert.equal(p.priceStatus, "estimate");
    assert.equal(p.checkoutEnabled, false);
    assert.equal(p.stockStatus, "unconfirmed");
    assert.ok(p.approximatePrice > 0);
    assert.ok(productPrice(p).startsWith("Approx. ₹"));
    assert.ok(!p.compareAtPrice);
    assert.equal(p.ownerApproved, false);
    const enquiry = decodeURIComponent(enquiryHref(p, migrated.site));
    assert.match(enquiry, /indicative only/);
    assert.ok(enquiry.includes(p.slug));
  }
  assert.equal(productPrice({ price: NaN }), "Price on enquiry");
  assert.equal(productPrice({ price: 0 }), "Price on enquiry");
  assert.equal(
    enquiryHref(publicProducts[0], {
      ...migrated.site,
      whatsapp: { ...migrated.site.whatsapp, number: "invalid" },
    }),
    "/contact",
  );
});
test("all real images and renditions exist and every homepage shelf resolves to published pieces", () => {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/realPhotography.json"), "utf8"),
  );
  assert.equal(catalog.photos.length, 28);
  for (const photo of catalog.photos)
    for (const size of ["large", "small"])
      assert.ok(
        fs.existsSync(path.join(root, "public", photo[size])),
        photo[size],
      );
  for (const p of publicProducts)
    for (const image of p.images) {
      assert.ok(fs.existsSync(path.join(root, "public", image.url)), image.url);
      assert.ok(image.alt.trim());
    }
  const slugs = new Set(publicProducts.map((p) => p.slug));
  assert.equal(slugs.size, 15);
  for (const section of Object.values(migrated.homepage.sections))
    if (section.productSlugs)
      for (const slug of section.productSlugs) assert.ok(slugs.has(slug), slug);
  assert.equal(validateAdminContent(migrated).errors, 0);
});
test("rollout is idempotent and subsequent admin edits are preserved", () => {
  const edited = structuredClone(migrated);
  edited.products.at(-1).title = "Owner updated title";
  assert.equal(preparePhotographyContent(edited), edited);
});
test("a provisional estimate cannot enable checkout or compare-at claims", () => {
  const changed = structuredClone(migrated);
  changed.products.find((p) => p.priceStatus === "estimate").checkoutEnabled =
    true;
  assert.ok(validateAdminContent(changed).errors > 0);
});
