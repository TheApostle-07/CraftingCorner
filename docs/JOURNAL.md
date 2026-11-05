# Crafting Corner Journal

## Architecture

The existing Next.js 15 App Router catalogue, Neon/Postgres client and signed
admin session are retained. The journal uses dedicated `blog_*` tables, not
GitHub JSON. Catalogue records and pricing are not migrated by this feature.
Public articles are server-rendered. TipTap is dynamically loaded only in the
admin editor; it is not included in readers' pages.

Code boundaries:

- `src/lib/blog`: validation, rich-text processing, database, publishing, media,
  authorization and discovery services.
- `src/app/api/admin/blog/[[...parts]]`: authenticated JSON and upload API.
- `src/components/admin/blog`: writing, media, taxonomy and revision interfaces.
- `src/components/blog` and `src/app/(site)/blog`: public journal and articles.
- `src/app/sitemap.ts`, `robots.ts`, `blog/feed.xml`: search discovery.
- `migrations/001_blog.sql`: additive schema; existing CMS tables are untouched.
- `scripts/blog-maintenance.cjs`: migration and optional private editorial seed.

## Setup

Use Node 22 LTS and pnpm 10.28.0. Install dependencies before running maintenance
commands; the command runner uses the project's TypeScript development dependency.

Keep these variables server-side in `.env.local` and the hosting environment:

```dotenv
DATABASE_URL=<existing Neon PostgreSQL URL>
ADMIN_USERNAME=<existing admin username>
ADMIN_PASSWORD=<admin password, or use ADMIN_PASSWORD_HASH instead>
ADMIN_SESSION_SECRET=<existing strong random session secret>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

`ADMIN_PASSWORD` takes precedence over `ADMIN_PASSWORD_HASH`, matching the existing
authentication implementation. Do not set a `NEXT_PUBLIC_` storage/database key.
Rotate any database passwords previously shared in chat. Changes to hosted
environment variables require a new deployment to take effect.

Cloudinary uses signed, server-side uploads. No unsigned preset is required.
The 28 bundled real photographs remain available if uploads are not configured.
Local uploads require `BLOG_LOCAL_UPLOADS=true` **and non-production mode**;
they are for local verification only, never persistent hosting storage.

Optional `BLOG_DATABASE_URL` overrides the database for journal staging. Optional
`BLOG_DATABASE_SCHEMA` isolates its tables. Production defaults to `public`.
Runtime table names are explicitly schema-qualified for pooled Neon connections;
migration search paths are transaction-local, not session-dependent.

## Migration And Release

1. Create a Neon branch or approved backup/recovery point. Review the additive SQL.
2. Configure a staging database/schema and the existing admin credentials.
3. Run `pnpm install --frozen-lockfile`, then `pnpm blog:migrate`.
4. Optionally run `pnpm blog:seed-drafts`. It creates six original **private**
   starter drafts and skips existing slugs. It never publishes a story.
5. Configure Cloudinary and verify a real upload in staging.
6. Run the checks below, review starter copy, and approve production release.
7. Add production environment variables, deploy the approved code and verify
   login, a private draft, upload, preview, publication, metadata and unpublishing.

Initialization is also idempotent on the first journal request. Runtime code only
reads the bundled SQL file; it does not write application files on Vercel.
Migration SQL is explicitly included in Next.js output tracing.

Do not remove the additive tables when reverting application code. Roll back to
the previous code deployment first; keep journal data intact. Restore an older
article from its revision history as a private draft, review it and republish.
Use the approved Neon recovery point for a database-wide recovery, not a blind
destructive reset. The test-only schema cleanup command in automated tests must
never be pointed at `public`.

## Writing And Publishing

Sign in at `/admin`, then open **Journal & articles**. You can create, duplicate,
search, filter, preview, archive, trash and restore articles. Manage categories,
real contributors and photographs from the journal sidebar.

Paste semantic HTML directly from a document or ChatGPT. Headings become H2-H4,
while paragraphs, emphasis, lists, safe links, quotes and tables are preserved.
The title field supplies the only H1. A toolbar dialog accepts Markdown or literal
plain text. Undo reverses the body paste. Review inferred plain-text headings.
External/embedded clipboard images are not fetched by the server; their source
is retained as an import note. Upload the image separately with permission and
replace the note. Unsupported embeds are not executed.

Autosave starts after 2.5 seconds without changes. Database content is authoritative;
local browser storage is only a secondary recovery copy, never authentication or
the main content store. Recovery and conflict screens offer a JSON download.
Do not clear browser storage when trying to recover an unsaved draft.

Publishing requires a title, excerpt, category, author, body and cover/inline alt
text. SEO fields, sharing image, canonical URL, featured status, tags and related
published products are editable. Metadata previews are illustrative, not promises
about how search engines will display a result.

Working fields and published snapshots are separate. Saving edits to a live story
does not change the public version. **Publish changes** explicitly replaces it.
The original publication time is retained and the public modification time updates.
Slug changes redirect old published URLs directly to the current article.
Unpublish/archive/trash removes public access; restore returns a private draft.
Revision restoration also returns a draft rather than silently republishing.
The latest 40 historical entries are shown; approximately 100 are retained.

Schedules use **Asia/Kolkata** in the interface and UTC in the database. The saved
scheduled snapshot is frozen; later working edits do not change it. Publication
is request-driven on the first journal/discovery/admin-list request after it is
due, with transactional locks and idempotent updates. This is not an exact-time
background job and does not assume a paid cron tier. If no visitor arrives, it
remains scheduled until the next request. Unpublishing cancels the schedule.

## Media Safety

JPEG, PNG, WebP and AVIF are accepted, up to 4 MB per file. The server bounds the
multipart body, checks signatures, decodes the image, rejects animation/unsafe
dimensions and resizes inside 2000px without enlargement. EXIF orientation is
applied and metadata is stripped when generating WebP. SVG and remote arbitrary
imports are not accepted. Cloudinary credentials/signatures stay on the server.

Alt text and captions are reusable. Cover alt text is specific to each article.
The library searches and paginates in PostgreSQL. Referenced images cannot be
deleted; original catalogue photographs are protected. External manual deletion
in Cloudinary bypasses this safeguard, so restrict storage-account access.

## SEO And Reader Experience

Public routes: `/blog`, `/blog/[slug]`, `/blog/category/[slug]`,
`/blog/author/[slug]`, `/blog/tag/[slug]`, `/blog/feed.xml`.

Features include canonical/Open Graph/Twitter metadata, BlogPosting and breadcrumb
JSON-LD, real publication/update times, reading time, anchored contents, topic-based
related stories, contextual collection links and existing WhatsApp/contact routes.
The home journal shows only genuinely published stories and is hidden when empty.
Search uses PostgreSQL full-text ranking plus title matching, with debounced UI
and an accessible GET form. Drafts never enter public search, feeds or sitemaps.
Tags/search and empty taxonomy pages request no indexing. Explicit noindex or
off-site canonical articles are omitted from sitemap/RSS.

The sitemap includes live catalogue URLs and eligible stories. Product JSON-LD
does not invent reviews or convert indicative prices into confirmed offers.
Organization/contact details come from existing site settings.

The journal retains the established Cormorant/Manrope typography, ivory/walnut
palette, uncropped photographs and restrained weights. Responsive grids, bounded
modals, keyboard focus, semantic controls, reduced-motion support, broken-image
states and useful empty/error states are included. No editor code is shipped to
public readers. Core Web Vitals and search rankings require real deployed
measurement; neither is guaranteed by this implementation.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:blog-integration
pnpm build
```

The integration command requires a database URL. It generates a `test_blog_*`
schema, validates the prefix before touching data, and removes only that schema
afterward. It covers creation/idempotency, revision conflicts, publishing, private
working edits, duplicate slug rejection, redirects, search, revisions, media
reference protection, unpublishing, scheduled publication, trash/restore and
development-only image processing. It never publishes into the public schema.

Owner/staging checklist:

1. Sign in, create a story, paste rich content, select category/author, upload a
   cover, add meaningful alt text and SEO copy.
2. Wait for a saved state, refresh, and confirm headings, lists, tables and links.
3. Open saved preview. Verify anonymous/forged sessions cannot access it.
4. Publish and verify public HTML, metadata, image, links, category, sitemap/RSS.
5. Save a working change and confirm public content stays unchanged; then republish.
6. Rename the slug and check the old URL redirects without a chain.
7. Unpublish: public URL must return 404 and disappear from lists/feed/sitemap.
8. Interrupt a save, retry it, test local recovery and a two-tab revision conflict.
9. Schedule a snapshot, edit the working copy, and verify only the scheduled
   snapshot becomes public after its due time and a request.
10. Test keyboard focus, mobile menu, editor, media dialog and reading at narrow,
    tablet and desktop widths, including 200% zoom.

## Release Verification Record

Completed locally on 5 November 2026:

- 13 unit/regression tests passed; database integration is explicitly opt-in.
- Node 22 production build completed with lint and type validation enabled.
  Public blog article first-load JavaScript was 111 kB; the editor route was
  229 kB before its separately loaded rich-text editor. These are build sizes,
  not real-user Core Web Vitals measurements.
- `pnpm audit --prod` returned no known vulnerabilities after compatible CSS
  dependency updates. Frozen pnpm resolution is retained in the lockfile.
- PostgreSQL lifecycle integration passed in a generated isolated schema.
- Browser: login, creation, rich paste, local upload/optimization, save/reopen,
  private preview, publish, working-draft isolation, republish and unpublish.
- Public HTML contained the real article body; canonical, JSON-LD, sitemap and RSS
  included the published test article and excluded private starter drafts.
- Anonymous admin/preview requests redirected; private API and forged cookies
  returned 401; authenticated cross-origin writes returned 403.
- Article overflow checks passed at 320, 360, 375, 390, 414, 430, 768, 1024,
  1280, 1440 and 1920px. Editor checks passed at 320, 360, 390, 768, 1024,
  1280, 1440 and 1920px; a 390px media dialog stayed within the viewport.
- An interrupted save preserved text; the device recovery draft was saved without
  exposing it on the live version. Unpublished public response returned 404.
- Built-app checks confirmed debounced search, category/author/tag routes,
  publication, and the unsaved-navigation confirmation without page errors.

Executed commands included `pnpm lint`, `pnpm typecheck`, `pnpm test`,
`BLOG_INTEGRATION=true node --test tests/blog.integration.test.cjs`,
and the production build with Node 22 via
`npx --yes --package=node@22 node node_modules/next/dist/bin/next build`.
Unit and integration tests were also rerun using Node 22. Browser verification
used an isolated `test_blog_*` schema and temporary local-only credentials;
neither those credentials nor test article records are part of the release.

Cloudinary live upload/deletion remains unverified until the owner configures the
three server-side credentials. Local adapter tests are not represented as a
Cloudinary test. No starter article was published on the production site.
Production deployment, real-user performance measurement, external SEO crawls,
and a full assistive-technology audit remain post-release checks.
