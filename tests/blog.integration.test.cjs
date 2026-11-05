const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { readModule, root } = require("../scripts/blog-runtime.cjs");
test(
  "transactional article and image lifecycle in an isolated PostgreSQL schema",
  { skip: process.env.BLOG_INTEGRATION !== "true", timeout: 180000 },
  async () => {
    require("@next/env").loadEnvConfig(root);
    const schema =
      process.env.BLOG_DATABASE_SCHEMA || `test_blog_${Date.now()}`;
    assert.match(
      schema,
      /^test_blog_[a-z0-9_]+$/,
      "Integration tests must never run in a production schema.",
    );
    process.env.BLOG_DATABASE_SCHEMA = schema;
    const db = readModule(path.join(root, "src/lib/blog/db.ts"));
    const svc = readModule(path.join(root, "src/lib/blog/service.ts"));
    const media = readModule(path.join(root, "src/lib/blog/media.ts"));
    try {
      await db.ensureBlogDatabase();
      const sql = db.blogSql();
      const opts = await svc.getBlogOptions();
      assert.equal(opts.media.length, 28);
      const key = randomUUID();
      let a = await svc.createArticle("integration", key);
      assert.equal((await svc.createArticle("integration", key)).id, a.id);
      assert.equal((await svc.listPublicArticles()).total, 0);
      assert.equal(await svc.getPublicArticle(a.slug), null);
      const fields = {
        ...svc.newArticleFields("A room with considered proportions"),
        categorySlug: "living-room-design",
        excerpt: "A useful guide to a comfortable seating layout.",
        coverImageId: opts.media[0].id,
        coverAlt: "Furniture in the Crafting Corner showroom",
        seoDescription:
          "Plan comfortable seating, clear walkways and a considered living room.",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Start with a plan" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Measure the room and mark the paths you use each day. Choose a layout that leaves the doors and walkways clear.",
                },
              ],
            },
          ],
        },
      };
      a = await svc.mutateArticle(a.id, "integration", {
        action: "save",
        fields,
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal(
        (await svc.getAdminArticle(a.id)).content.content[0].type,
        "heading",
      );
      const revision = a.revision;
      const mutationId = randomUUID();
      a = await svc.mutateArticle(a.id, "integration", {
        action: "publish",
        fields,
        revision,
        mutationId,
      });
      assert.equal(
        (
          await svc.mutateArticle(a.id, "integration", {
            action: "publish",
            fields,
            revision,
            mutationId,
          })
        ).revision,
        a.revision,
      );
      assert.equal(
        (await svc.getPublicArticle(a.slug)).article.title,
        fields.title,
      );
      await assert.rejects(
        () =>
          svc.mutateArticle(a.id, "other editor", {
            action: "save",
            fields,
            revision,
            mutationId: randomUUID(),
          }),
        (e) => e.status === 409,
      );
      await assert.rejects(
        () => svc.createArticle("integration", randomUUID(), fields),
        (e) => e.status === 409,
      );
      a = await svc.mutateArticle(a.id, "integration", {
        action: "save",
        fields: { ...fields, title: "Unfinished working copy" },
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal(
        (await svc.getPublicArticle(a.slug)).article.title,
        fields.title,
      );
      const oldSlug = a.slug;
      a = await svc.mutateArticle(a.id, "integration", {
        action: "publish",
        fields: { ...fields, slug: "a-new-room-address" },
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal((await svc.getPublicArticle(oldSlug)).redirect, a.slug);
      assert.equal((await svc.listPublicArticles({ q: "walkways" })).total, 1);
      assert.ok((await svc.revisionsForArticle(a.id)).length >= 3);
      await assert.rejects(
        () => media.deleteBlogImage(opts.media[0].id),
        (e) => e.status === 409,
      );
      a = await svc.mutateArticle(a.id, "integration", {
        action: "unpublish",
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal(await svc.getPublicArticle(a.slug), null);
      assert.equal((await svc.listPublicArticles()).total, 0);
      a = await svc.mutateArticle(a.id, "integration", {
        action: "schedule",
        fields: { ...fields, slug: "future-room" },
        scheduledAt: new Date(Date.now() + 120000).toISOString(),
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal(await svc.getPublicArticle("future-room"), null);
      a = await svc.mutateArticle(a.id, "integration", {
        action: "save",
        fields: { ...fields, slug: "working-room" },
        revision: a.revision,
        mutationId: randomUUID(),
      });
      await assert.rejects(
        () =>
          svc.createArticle("integration", randomUUID(), {
            ...fields,
            slug: "future-room",
          }),
        (e) => e.status === 409,
      );
      await sql`update ${db.blogTable("blog_articles")} set scheduled_at=now()-interval '1 second' where id=${a.id}`;
      await svc.publishDueArticles();
      await svc.publishDueArticles();
      assert.equal(
        (await svc.getPublicArticle("future-room")).article.title,
        fields.title,
      );
      assert.equal((await svc.listPublicArticles()).total, 1);
      a = await svc.getAdminArticle(a.id);
      a = await svc.mutateArticle(a.id, "integration", {
        action: "delete",
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal((await svc.listPublicArticles()).total, 0);
      a = await svc.mutateArticle(a.id, "integration", {
        action: "restore",
        revision: a.revision,
        mutationId: randomUUID(),
      });
      assert.equal(a.status, "draft");
      assert.equal(a.live, null);
      const sharp = require("sharp");
      const image = await sharp({
        create: { width: 320, height: 240, channels: 3, background: "#e8dccb" },
      })
        .png()
        .toBuffer();
      process.env.BLOG_LOCAL_UPLOADS = "true";
      const uploaded = await media.uploadBlogImage(
        new File([image], "test-photo.png", { type: "image/png" }),
        "A test image",
        "Test caption",
      );
      assert.equal(uploaded.width, 320);
      assert.match(uploaded.url, /\.webp$/);
      await media.deleteBlogImage(uploaded.id);
      await assert.rejects(
        () =>
          media.uploadBlogImage(
            new File(["not a real image"], "fake.jpg", { type: "image/jpeg" }),
            "",
            "",
          ),
        (e) => e.status === 400,
      );
      console.log(
        "Verified create, idempotency, CAS conflict, publish, draft isolation, rename, search, revisions, protected images, unpublish, scheduling, deletion, restore and local image processing.",
      );
    } finally {
      const sql = db.blogSql();
      await sql.unsafe(`drop schema if exists "${schema}" cascade`);
      await sql.end();
    }
  },
);
