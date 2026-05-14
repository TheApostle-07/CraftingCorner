## Crafting Corner

Next.js catalogue site with an admin CMS. Production can use Neon Postgres for
instant persistent content edits, with GitHub JSON storage still available as a
fallback.

## Admin CMS

Open `/admin`, sign in, edit content, then save. When `DATABASE_URL` is set,
the admin API stores content in Neon Postgres and public pages read the updated
database content on request. No redeploy is needed for catalogue edits.

If `CMS_CONTENT_STORAGE=github` is set, the same admin commits JSON changes to
GitHub instead. Vercel or Hostinger can then rebuild from the updated branch.

Editable files live in `src/data`:

- `site.json`
- `homepage.json`
- `categories.json`
- `productTypes.json`
- `products.json`
- `testimonials.json`
- `seo.json`
- `footer.json`
- `navigation.json`

Required production environment variables:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=sha256:<sha256-password-hash>
ADMIN_SESSION_SECRET=<long-random-secret>
DATABASE_URL=<neon-postgres-connection-string>
CMS_CONTENT_STORAGE=database
```

Optional GitHub fallback:

```env
GITHUB_TOKEN=<fine-grained-token-with-contents-read-write>
GITHUB_OWNER=TheApostle-07
GITHUB_REPO=CraftingCorner
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=src/data
```

`ADMIN_PASSWORD` is still supported for local setup, but use
`ADMIN_PASSWORD_HASH` in production. Generate the hash with:

```bash
node -e "console.log('sha256:' + require('node:crypto').createHash('sha256').update('your-password').digest('hex'))"
```

Database tables are created automatically:

- `cms_documents`
- `cms_revisions`

The Neon connection string and GitHub token must stay server-side. Do not expose
either value to browser code. If a database URL has been shared in chat or logs,
rotate that password in Neon before deploying.

## Local Development

```bash
pnpm install
pnpm dev
```

In local development without `DATABASE_URL` or GitHub env vars, admin saves write
directly to the JSON files in `src/data`. In production, use Neon
`DATABASE_URL` for persistent admin saves, or force GitHub mode with
`CMS_CONTENT_STORAGE=github`.

## Validation

The admin blocks saves when content has validation errors such as duplicate
slugs, invalid WhatsApp number, products assigned to deleted categories, or
homepage sections referencing missing products. Warnings are shown for weaker
content such as missing images, alt text, descriptions, and SEO fields.
