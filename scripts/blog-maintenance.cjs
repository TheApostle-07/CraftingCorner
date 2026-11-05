const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { readModule, root } = require("./blog-runtime.cjs");
require("@next/env").loadEnvConfig(root);
async function main() {
  const db = readModule(path.join(root, "src/lib/blog/db.ts"));
  try {
    await db.ensureBlogDatabase();
    console.log(
      `Additive blog migration ready in schema ${process.env.BLOG_DATABASE_SCHEMA || "public"}.`,
    );
    if (process.argv.includes("--seed-drafts")) {
      const svc = readModule(path.join(root, "src/lib/blog/service.ts"));
      const { starterDrafts } = readModule(
        path.join(root, "src/lib/blog/starterDrafts.ts"),
      );
      const { fromMarkdownSimple, blogSlug } = readModule(
        path.join(root, "src/lib/blog/content.ts"),
      );
      for (const item of starterDrafts) {
        const slug = blogSlug(item.title);
        const [exists] =
          await db.blogSql()`select id from ${db.blogTable("blog_articles")} where slug=${slug}`;
        if (exists) {
          console.log(`Skipped existing draft: ${slug}`);
          continue;
        }
        const fields = {
          ...svc.newArticleFields(item.title),
          categorySlug: item.category,
          coverImageId: `photo-${item.photo}`,
          coverAlt:
            item.photo === "DSC00087"
              ? "Sofa arrangement in the Crafting Corner showroom"
              : item.photo === "DSC00097"
                ? "Wood-frame bed displayed in the Crafting Corner showroom"
                : "Furniture displayed inside the Crafting Corner showroom",
          excerpt: item.excerpt,
          seoTitle: item.title,
          seoDescription: item.excerpt,
          tags: [],
          content: fromMarkdownSimple(
            item.sections
              .map(([heading, body]) => `## ${heading}\n\n${body}`)
              .join("\n\n"),
          ),
        };
        fields.content.content.push(
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Explore the collection",
                marks: [{ type: "link", attrs: { href: "/products" } }],
              },
              { type: "text", text: " or " },
              {
                type: "text",
                text: "speak with Crafting Corner",
                marks: [{ type: "link", attrs: { href: "/contact" } }],
              },
              { type: "text", text: " about your space." },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              { type: "text", text: "Editorial review before publication" },
            ],
          },
          { type: "paragraph", content: [{ type: "text", text: item.review }] },
        );
        await svc.createArticle("editorial-seed", randomUUID(), fields);
        console.log(`Created private draft: ${slug}`);
      }
    }
  } finally {
    await db.blogSql().end();
  }
}
main().catch((error) => {
  console.error("Blog maintenance failed:", error.code || error.message);
  process.exitCode = 1;
});
