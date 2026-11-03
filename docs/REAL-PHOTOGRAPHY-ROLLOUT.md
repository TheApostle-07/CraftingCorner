# Real photography rollout

## Preview and publishing

Prepared locally; no production database records have been changed. After deployment, a versioned transformation presents the real photography catalogue against either the earlier Neon seed or the bundled JSON. Admin reads the same transformed content. Its next authenticated save persists that version, and later edits are respected.

The 47 previous products are retained as drafts with original recorded prices, slugs and image references. Their old links lead to the refreshed collection. No new photograph is claimed to match an old SKU. Existing categories without current photography lead to the collection.

```sh
CMS_CONTENT_STORAGE=local SITE_STATUS_STORAGE=local-file pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Package manager: pnpm 10.28.0. Build validation is enabled.

## Image map

| Area | New photographs |
| --- | --- |
| Homepage hero | DSC00397, cream and gold lounge |
| Living Room | DSC00087, contemporary seating scene |
| Bedroom | DSC00097, bedroom setting |
| Study & Office | DSC00118, writing desk setting |
| Custom Furniture inspiration | DSC00374, classic lounge setting |
| About and Contact | DSC00391 and DSC00056, actual showroom photographs |
| Craft details | DSC00415, DSC00431, DSC09420 |
| Additional showroom gallery | DSC00051, DSC00061, DSC09434, DSC00056 |
| Product-type tiles | Actual table, chair, console, stand and desk photographs |
| Products | 15 supplied enquiry drafts and their photographs |

All 28 photographs have small and large WebP renditions under `public/images/real/`. Product images use full portrait frames. They have not been recoloured or regenerated. Original JPGs remain untouched in the supplied Downloads folder and are not served as public downloads. Exact Drive references and the full mapping are preserved in `src/data/realPhotography.json`.

## Indicative prices

The confirmed `price` stays at 0. `approximatePrice` holds the supplied estimate. Every listing shows `Approx.` and `Final price on enquiry`, with unconfirmed availability. Checkout, MRP and discounts are disabled.

| Product | Approximate INR | Photos | Sales unit to verify |
| --- | ---: | --- | --- |
| Coral Sculptural Accent Table | 24,900 | DSC09402, DSC09413 | One table |
| Loop-Base Designer Console Table | 54,900 | DSC02250 | One console |
| Curved Sculptural Accent Stools | 18,900 | DSC09422 | Per stool, not pair |
| Black Sculptural Accent Stool | 18,900 | DSC09415 | Per stool; possible variant |
| Gold-Tone Three-Tier Display Stand | 12,900 | DSC02274 | Stand only |
| Black Round Pedestal Side Table | 16,900 | DSC02283 | Table only |
| Light Round Pedestal Side Table | 18,900 | DSC02298 | Table only |
| Burgundy Upholstered Recliner | 34,900 | DSC02307 | Chair; mechanism unverified |
| Red Tufted Classic Armchair | 42,900 | DSC00344 | One chair |
| Ornate High-Back Accent Chair | 59,900 | DSC00425 | One chair |
| Traditional Wood Bedside Cabinet | 16,900 | DSC00103 | Cabinet only |
| Carved Mirror Console / Vanity | 54,900 | DSC00108 | Console and mirror assumed |
| Classic Wood Writing Desk | 39,900 | DSC00118 | Desk only, chair excluded |
| Tall Gold-Tone Display Stand | 12,900 | DSC02269 | Stand only |
| Glass-Top Woven-Base Side Table | 19,900 | DSC02288 | Table only |

## Owner verification

Confirm SKU, final price, sales unit, materials, dimensions, finish, stock and warranty before marking prices confirmed. DSC09402/DSC09413 are one coral table listing. DSC09422/DSC09415 may be variants of the same stool and remain enquiry drafts. Accessories are excluded unless explicitly confirmed.

Editorial scenes: DSC00397, DSC00087, DSC00391, DSC00097, DSC00374, DSC00051, DSC00061, DSC09434, DSC00056. Details: DSC00415, DSC00431, DSC09420. Scene benchmark prices are not displayed. Unverified testimonials are hidden.

## Enquiries and reliability

WhatsApp enquiries include product identity, indicative pricing and URL. Invalid/disabled numbers fall back to Contact. `/api/enquiry` validates and forwards contact submissions. It reports success only on an explicit JSON success response. Set `LEAD_WEBHOOK_URL` to override the existing Apps Script receiver. Accepted responses contain `success: true`, `ok: true`, `result: "success"` or `status: "success"`. A failed response preserves form contents and shows retry feedback.

CMS reads are deduplicated within each render and fall back to bundled content on failure. That fallback can be older than recent admin edits. Database saves acquire row locks and recheck revision versions. Native dialogs contain keyboard focus and support Escape. Broken images show a neutral placeholder. Both responsive WebP sizes are delivered with proportional image frames.

## Verification

- Production build passes with lint and TypeScript validation enabled, using Next.js 15.5.28.
- Five catalogue tests pass: preserved original prices, estimate semantics, asset/reference integrity, idempotent rollout, and checkout guards.
- All 23 checked public routes and 56 WebP URLs return successfully. Three legacy routes redirect to the refreshed collection. Unauthenticated admin content requests return 401.
- Product detail layout was checked at 320, 390, 768, 1024, 1440 and 1920 pixels without horizontal overflow. The homepage, mobile menu, quick view, alternate images and product enquiry links were also inspected.
- Contact success and failure flows were tested against a local receiver, including preserving form values on failure and focusing the visible confirmation on success. No test enquiries were sent to the live receiver. Its deployed POST response still needs to satisfy the documented success contract.
- The homepage first-load JavaScript is approximately 110 kB, compared with 164 kB in the earlier build. This is a build comparison, not a field-performance measurement.

Review screenshots: [Desktop](previews/hero-desktop.png), [Mobile](previews/home-mobile.png), [Quick view](previews/quick-view-mobile.png), [Contact confirmation](previews/contact-success-mobile.png).
