## Crafting Corner

Next.js catalogue site with a GitHub-backed admin CMS. No database is required
for content management.

## Admin CMS

Open `/admin`, sign in, edit content, then save. In production, the admin API
commits JSON changes to GitHub. Vercel or Hostinger can then rebuild from the
updated branch.

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

The GitHub token must stay server-side. Do not expose it to browser code.

## Local Development

```bash
pnpm install
pnpm dev
```

In local development without GitHub env vars, admin saves write directly to the
JSON files in `src/data`. In production, GitHub env vars are required for saves.

## Validation

The admin blocks saves when content has validation errors such as duplicate
slugs, invalid WhatsApp number, products assigned to deleted categories, or
homepage sections referencing missing products. Warnings are shown for weaker
content such as missing images, alt text, descriptions, and SEO fields.
