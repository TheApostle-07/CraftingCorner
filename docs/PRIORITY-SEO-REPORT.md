# Crafting Corner SEO implementation

Audited the [production storefront](https://www.craftingcorner.in/) on 7 November 2026, India Standard Time. This report records the baseline before the SEO release and the local verification of the release candidate.

## Completed fixes

| Area | Implementation |
| --- | --- |
| Homepage | The title identifies Crafting Corner and bespoke furniture in Mohali. The description introduces the studio and sets expectations for browsing the showroom and discussing a project. |
| Business identity | The homepage has a linked `WebSite` and `FurnitureStore` JSON-LD graph. `FurnitureStore` is a subtype of `LocalBusiness`. Fields come from the current site's brand, logo, contact details and social profiles. The address uses the confirmed locality, region and country. |
| Public metadata | Home, About, Contact, Catalogue, room collections, product detail, Journal and articles declare canonical URLs on the HTTPS `www` host. About, Contact, Catalogue and each current room collection have distinct titles and descriptions. Product metadata uses configured CMS fields where present and falls back to the product's own copy. |
| Categories and redirects | Room summaries now describe the pieces actually listed and distinguish showroom inspiration from individual products. Catalogue search and filter URLs stay accessible to visitors with `noindex` and a clean Catalogue canonical. Matching category/product aliases return `308` to the existing product URL. Known retired routes keep a temporary path to the catalogue, and unrelated category/product combinations return `404`. |
| Sitemap and robots | The XML sitemap includes canonical public storefront pages, populated room collections, the Custom Furniture service page and eligible Journal content. It excludes search results, drafts, redirects and alternate canonicals. It includes product image URLs and published article cover images, with XML escaping and duplicate removal. The endpoint returns `503` when the storefront is on hold or discovery data fails to load. Robots allows crawlers to see the Journal's `noindex` directives. |
| Journal | Live article snapshots render the body, author, related pieces and internal links on the server. Published articles have a title, description, canonical, social metadata and `BlogPosting` JSON-LD. Valid archive pagination is self-canonical. Empty archives, search results, author archives and tags are excluded from indexing. Out-of-range page numbers return `404`. |
| Admin and drafts | The login screen is crawlable so engines can read its `noindex` directive. Admin workspaces, previews and APIs enforce authentication. Admin and API responses have a `noindex, nofollow` header. Unpublished articles do not have public routes. Hidden testimonials are left out of the homepage payload. |
| Product photography and delivery | All 28 authentic showroom photographs have an additional 900px WebP rendition. The responsive sources use their measured widths, the product layout advertises the actual display slot, and the original large WebP URLs remain in the image sitemap. Primary photographs retain descriptive alt text and reserved layout space. Fonts used by the inactive-site screen are only fetched when that screen uses them. |
| Conversions | The footer offers optional analytics when credentials are configured. WhatsApp clicks count as `whatsapp_click`. An acknowledged Contact or Callback submission counts as `generate_lead`, with `form_kind` set to `contact` or `callback`. The first-party relay forwards an event name, random tab identifier and the fixed form kind where applicable. Advertising consent is denied and no form text, contact fields, URLs or WhatsApp message text are forwarded. |

References: [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Schema.org FurnitureStore](https://schema.org/FurnitureStore).

## Verified results

The live audit retrieved all 24 sitemap URLs. The sitemap contained 15 product detail pages, four room or service collections and five core pages, including an empty Journal. All nine Journal category archives and the author archive were empty and declared `noindex`. The sampled article slug returned `404`. The live RSS feed and sitemap listed no published articles. About, Contact, Catalogue and the four room pages lacked canonicals. Living Room, Bedroom and Study & Office shared a description. The live sitemap's `lastmod` ordering failed strict schema validation. The legacy product alias returned `307`, the admin preview redirected to login and the admin content API returned `401`.

The final build passed ESLint and TypeScript checks and all **23** tests, including the isolated PostgreSQL lifecycle test. The local sitemap contained **23** URLs without Journal content and **35** with test articles. Both passed the sitemap and image extension XSDs. The raw HTML checks found unique titles and descriptions, one head canonical and an H1 on all 35 sitemap pages. All 10 indexable fixture articles had server-rendered text and internal links. The checks also exercised draft access, canonical overrides, `noindex`, pagination, redirects, unauthenticated admin access and the RSS feed.

Chromium checked **54** page and viewport combinations across **320, 390, 768, 1024, 1440 and 1920 px** with no horizontal overflow or browser exceptions. All **84** WebP URLs returned the expected content type. At 390 px with 2× pixel density, Chromium selected the 900px homepage and product images. The isolated conversion test recorded one WhatsApp click and one confirmed contact submission. It recorded zero events before consent, on the failed submission and after revocation. Google Analytics and the enquiry receiver were simulated.

### Performance

| Lighthouse 13.6 homepage lab run | LCP | CLS | Total blocking time | Performance score |
| --- | ---: | ---: | ---: | ---: |
| Live site, mobile | 4.10 s | 0.00001 | 108 ms | 76 |
| Final local production build, mobile | 4.14 s | 0.00000 | 69 ms | 86 |
| Final local production build, desktop | 0.72 s | 0.00000 | 0 ms | 100 |

The local runs used localhost. Mobile LCP remains above Google's 2.5 s good threshold in the lab, and the runs used different hosting environments. The new mobile run selected the 900px hero rendition at **100,934 bytes**. The live run selected the large rendition at **264,452 bytes**. All 28 medium renditions are smaller than their large counterparts. The local homepage fetched two fonts totalling **62,212 bytes** after removing five hold-screen preloads that had added **66,988 bytes** in the earlier local run. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

## Unresolved dependencies

- **Search Console and field vitals.** Site ownership and the Search Console reports require owner access. The PageSpeed Insights API returned HTTP `429` during this audit. Production p75 LCP, INP and CLS remain unverified. Lighthouse is a lab run, and total blocking time is a lab metric. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- **Host redirect.** Production HTTP upgrades use `308`. HTTPS on the bare host currently redirects to `www` with `307`. Check the hosting-domain redirect after approval and make the HTTPS bare-to-`www` redirect permanent if that host preference is settled.
- **Complete business address.** The current site confirms Mohali, Punjab, India. Confirm the current street address and postal code, opening hours and showroom information before adding those fields to the site and business listing. The structured data uses the verified locality information today. Full-address rich result eligibility remains unverified. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- **Live Journal content.** The public Journal, RSS and sitemap exposed zero articles at audit time. Local fixtures verify the publishing paths. A real article and its editorial approval are needed for production article URL Inspection.
- **Analytics reporting.** The owner needs a GA4 web stream and a Measurement Protocol secret. Set `GA4_MEASUREMENT_ID` and `GA4_MEASUREMENT_PROTOCOL_SECRET` as server-only variables. Use an isolated test stream to confirm ingestion, then mark `whatsapp_click` and `generate_lead` as key events and register `form_kind` as an event-scoped custom dimension. Confirm appearance in the Events report. The relay measures event counts without a browser analytics tag. Traffic attribution and a sessions-based conversion rate are outside this configuration. [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

## Editorial actions

1. **Testimonials.** The four bundled entries have no approval record in the repository. Keep the section hidden until the owner verifies the wording, the customer attribution and permission to publish.
2. **Journal bylines and claims.** The seeded byline is the Crafting Corner organization. The six starter drafts cover sofas, wood materials, dining sizing, custom furniture, bed sizing and furniture care. Approve authorship, practical guidance and product or material assertions before publishing. Add credentials only when documented.
3. **Catalogue approval.** The 15 photo-led products use indicative prices and await owner verification. Confirm product name and category, SKU, dimensions, material, finish, mechanism, sales unit, availability, warranty and final price against the photographed piece. Confirm whether the sculptural stools are variants or a pair, whether the carved console includes the mirror, and whether the wood-toned table is sold as a writing desk or console. Prices and product records were preserved.
4. **Showroom scenes and legacy categories.** Seating and bedroom photographs illustrate rooms. The current listing has chairs, bedside storage and a vanity. Confirm actual sofa and bed offerings before describing them as available. The Dining Room route currently leads to the catalogue. Restore that collection at its existing URL when there are verified products and original photographs.

## Keyword-to-page map

| Search intent | Target | Status and page brief |
| --- | --- | --- |
| Luxury furniture Mohali, premium furniture showroom Mohali | `/` | Brand and showroom discovery. Lead with the studio's Mohali location, authentic photography and a clear showroom or enquiry next step. |
| Custom furniture Mohali, bespoke furniture Mohali | `/custom` | Commission enquiry. Describe verified options, consultation, measurements and finishes. Link to Contact. |
| Luxury sofas Mohali, custom sofas Mohali | `/living-room` | Existing room page. It currently has accent seating and showroom inspiration. Add verified sofa models, upholstery options and photographs before targeting sofa inventory terms. |
| Luxury beds Mohali, custom beds Mohali | `/bedroom` | Existing room page. It currently has bedroom accents. Add approved beds, sizes and photographs before targeting bed inventory terms. |
| Luxury dining furniture Mohali, custom dining table Mohali | `/dining-room` | Reserved for the existing legacy room URL when a genuine dining collection is ready. Use confirmed dining pieces and useful measurements. |
| Crafting Corner Mohali address, Crafting Corner contact | `/contact` | Showroom and enquiry intent. Keep contact details consistent with the confirmed business profile. |
| Furniture buying questions | `/blog/{article-slug}` | Publish an approved guide only when it answers a distinct question. Link to the most relevant live room or service page. |

## Search Console handoff

1. Sign in with the business-owned Google account and add the Domain property `craftingcorner.in`. Add the exact TXT verification record Google provides at the DNS provider and complete verification. Retain the record.
2. After release approval and deployment, open the HTTPS `www` homepage, `/robots.txt` and `/sitemap.xml`. Confirm the current release serves the intended directives and the sitemap responds with XML.
3. In Search Console, open **Sitemaps** for the property and submit `https://www.craftingcorner.in/sitemap.xml`. Record the submission date, status, last read and discovered URL count. Check for any fetch or parsing errors.
4. Use **URL Inspection** for Home, Custom, Living Room, Bedroom, Contact, one product and one approved article when available. Run the live test, confirm crawl and index eligibility, inspect rendered HTML and record user-declared and Google-selected canonicals when shown.
5. Inspect one filtered catalogue URL, one retired URL and the admin login. Check the expected `noindex` or redirect. Review the Page Indexing report for blocked, redirected, duplicate and soft-`404` URLs.
6. Save the initial export and schedule a review after a full 28-day post-release window. Check Core Web Vitals for Mobile and Desktop separately and note whether each group has enough field data.

References: [Ownership verification](https://support.google.com/webmasters/answer/9008080), [Sitemaps report](https://support.google.com/webmasters/answer/7451001), [URL Inspection](https://support.google.com/webmasters/answer/9012289).

## Baseline reporting template

Use comparable 28-day date ranges. Record the property, dates, country and device filters, Search type and any release or editorial changes. Leave unavailable values blank and use zero only when the source reports zero.

| Metric | Source and segment | Baseline 28 days | Follow-up 28 days | Change or notes |
| --- | --- | --- | --- | --- |
| Clicks, impressions, CTR, average position | Search Console Performance, Web, all pages | | | |
| Clicks, impressions, CTR | Search Console Performance, Image | | | |
| Branded vs non-branded clicks and impressions | Search Console, separate saved query filters | | | |
| Clicks, impressions, CTR, average position | Search Console, target pages and query groups in keyword map | | | |
| Indexed URLs, discovered sitemap URLs, exclusions | Search Console Page Indexing and Sitemaps | | | |
| LCP, INP, CLS at p75 | CrUX, Mobile and Desktop, include URL or origin scope | | | |
| WhatsApp clicks | GA4 `whatsapp_click`, consented events | | | |
| Confirmed forms and callbacks | GA4 `generate_lead` by `form_kind`, consented events | | | |
| Received enquiries | Lead sheet, aggregate by reporting window | | | |
