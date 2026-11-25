const assert = require("node:assert/strict");
const { createHash, randomUUID } = require("node:crypto");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");
const { readModule, root } = require("./blog-runtime.cjs");
const stories = require("../src/data/journalLaunch.json");
const photos = require("../src/data/realPhotography.json").photos;

const { fromMarkdownSimple } = readModule(
  path.join(root, "src/lib/blog/content.ts"),
);
const { parseArticleFields, publishingIssues } = readModule(
  path.join(root, "src/lib/blog/validation.ts"),
);
const db = readModule(path.join(root, "src/lib/blog/db.ts"));
const service = readModule(path.join(root, "src/lib/blog/service.ts"));

function prepare(story) {
  const { photo, detailPhoto, detailAlt, sections, intro, link, ...metadata } =
    story;
  const detail = photos.find(
    ({ filename }) => filename === `${detailPhoto}.JPG`,
  );
  assert.ok(detail, `Unknown detail photo for ${story.slug}`);
  const content = fromMarkdownSimple(intro);
  for (const [index, [heading, ...paragraphs]] of sections.entries()) {
    const section = fromMarkdownSimple(
      [`## ${heading}`, ...paragraphs].join("\n\n"),
    );
    content.content.push(...section.content);
    if (index === 1)
      content.content.push({
        type: "image",
        attrs: { src: detail.large, alt: detailAlt },
      });
  }
  content.content.push({
    type: "paragraph",
    content: [
      {
        type: "text",
        text: link.label,
        marks: [{ type: "link", attrs: { href: link.href } }],
      },
      { type: "text", text: "." },
    ],
  });
  const fields = parseArticleFields({
    ...service.newArticleFields(story.title),
    ...metadata,
    seoDescription: story.excerpt,
    coverImageId: `photo-${photo}`,
    content,
  });
  assert.deepEqual(publishingIssues(fields), [], story.slug);
  return fields;
}

function publicationKey(slug) {
  const hex = createHash("sha256")
    .update(`crafting-corner:journal-launch:${slug}`)
    .digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function main() {
  const entries = stories.map(prepare);
  const mode = process.argv[2];
  if (mode === "--check") {
    console.log(`Validated ${entries.length} journal articles.`);
    return;
  }
  if (mode !== "--publish" || !db.blogDatabaseConfigured())
    throw new Error(
      "Use --check or supply the target database environment and --publish.",
    );

  const actor = "journal-launch";
  try {
    const options = await service.getBlogOptions();
    const sql = db.blogSql();
    const plans = [];
    for (const fields of entries) {
      assert.ok(
        options.categories.some(({ slug }) => slug === fields.categorySlug),
      );
      assert.ok(options.authors.some(({ id }) => id === fields.authorId));
      const key = publicationKey(fields.slug);
      const rows =
        await sql`select id, client_key, revision, status, fields, live_slug, deleted_at
        from ${db.blogTable("blog_articles")}
        where client_key=${key} or slug=${fields.slug} or live_slug=${fields.slug}
          or scheduled_snapshot->>'slug'=${fields.slug}`;
      const aliases =
        await sql`select slug from ${db.blogTable("blog_redirects")} where slug=${fields.slug}`;
      assert.ok(
        !aliases.length && rows.length <= 1,
        `Journal URL already reserved: ${fields.slug}`,
      );
      const row = rows[0];
      if (
        row?.client_key === key &&
        !row.deleted_at &&
        row.live_slug === fields.slug
      ) {
        console.log(`Already live: /blog/${fields.slug}`);
        continue;
      }
      assert.ok(
        !row ||
          (row.client_key === key &&
            row.revision === 1 &&
            row.status === "draft" &&
            !row.deleted_at &&
            isDeepStrictEqual(row.fields, fields)),
        `Journal record needs editorial review: ${fields.slug}`,
      );
      plans.push({ fields, key });
    }
    const drafts = [];
    for (const { fields, key } of plans)
      drafts.push(await service.createArticle(actor, key, fields));
    for (const draft of drafts) {
      // A retry can resume our initial draft. Editors retain control after that.
      if (draft.liveSlug === draft.slug && draft.live) continue;
      assert.equal(draft.revision, 1, `Draft changed: ${draft.slug}`);
      await service.mutateArticle(draft.id, actor, {
        action: "publish",
        revision: draft.revision,
        mutationId: randomUUID(),
      });
      console.log(`Published: /blog/${draft.slug}`);
    }
  } finally {
    await db.blogSql().end();
    await globalThis.craftingCornerCmsSql?.end();
  }
}

main().catch((error) => {
  console.error("Journal launch failed:", error.code || error.message);
  process.exitCode = 1;
});
