const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const { readModule, root } = require("../scripts/blog-runtime.cjs");
const content = readModule(path.join(root, "src/lib/blog/content.ts"));
const validation = readModule(path.join(root, "src/lib/blog/validation.ts"));
const seo = readModule(path.join(root, "src/lib/seo.ts"));
const text = (s) => ({ type: "text", text: s });
test("slugs are stable, transliterated and URL safe", () => {
  assert.equal(
    content.blogSlug("  Café & Home: Better Living! "),
    "cafe-and-home-better-living",
  );
  assert.equal(content.blogSlug("💡"), "");
  assert.equal(content.blogSlug("a".repeat(200)).length, 160);
});
test("Markdown preserves headings, emphasis, nested lists, quotes, links and tables", () => {
  const result = content.preparePaste(
    "# A considered room\n\n## Proportions\n\nA **clear** idea with *texture*.\n\n- Seat\n  - Cushion\n\n> A quiet corner.\n\n[Collection](/products)\n\n| A | B |\n|---|---|\n| 1 | 2 |",
    "",
    "markdown",
  );
  for (const token of [
    "<h2>",
    "<strong>",
    "<em>",
    "<ul>",
    "<blockquote>",
    'href="/products"',
    "<table>",
  ])
    assert.ok(result.html.includes(token), token);
  assert.equal(result.title, "A considered room");
});
test("clipboard sanitization removes scripts, arbitrary styles, unsafe links and external images", () => {
  const result = content.cleanClipboardHTML(
    '<h1>Title</h1><p style="color:red" onclick="evil()">Hello <strong>world</strong></p><script>alert(1)</script><a href="javascript:evil()">bad</a><img src="https://outside.test/photo.jpg" alt="Chair">',
  );
  assert.ok(!/onclick|javascript:|<script|style=/.test(result.html));
  assert.match(result.html, /Image needs importing/);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.title, "Title");
  assert.match(result.html, /<strong>world/);
});
test("plain text remains literal and large pastes are bounded", () => {
  const result = content.preparePaste(
    "# Not a heading\n\n<script>literal</script>",
    "",
    "plain",
  );
  assert.ok(!result.html.includes("<h2>"));
  assert.match(result.html, /&lt;script&gt;/);
  assert.throws(() => content.preparePaste("x".repeat(500001), "", "plain"));
});
test("validated JSON cannot introduce unsafe nodes, URLs, H1s or arbitrary attributes", () => {
  const doc = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2, style: "bad" },
        content: [text("A room")],
      },
    ],
  };
  assert.deepEqual(content.validateDocument(doc).content[0].attrs, {
    level: 2,
  });
  assert.throws(() =>
    content.validateDocument({
      type: "doc",
      content: [{ type: "heading", attrs: { level: 1 } }],
    }),
  );
  assert.throws(() =>
    content.validateDocument({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              ...text("click"),
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
          ],
        },
      ],
    }),
  );
  assert.throws(() =>
    content.validateDocument({
      type: "doc",
      content: [{ type: "image", attrs: { src: "data:image/svg+xml,evil" } }],
    }),
  );
});
test("dates use India Standard Time and reject overflow dates", () => {
  assert.equal(
    validation.kolkataToUTC("2026-11-06T09:30"),
    "2026-11-06T04:00:00.000Z",
  );
  assert.throws(() => validation.kolkataToUTC("2026-02-31T09:30"));
  assert.throws(() => validation.kolkataToUTC("invalid"));
});
test("drafts, future dates and deleted articles cannot pass publication eligibility", () => {
  assert.equal(
    validation.isPublicArticle({
      live: null,
      publishedAt: new Date().toISOString(),
    }),
    false,
  );
  assert.equal(
    validation.isPublicArticle({
      live: {},
      publishedAt: new Date(Date.now() + 60000).toISOString(),
    }),
    false,
  );
  assert.equal(
    validation.isPublicArticle({
      live: {},
      publishedAt: "2020-01-01",
      deletedAt: "2026-01-01",
    }),
    false,
  );
  assert.equal(
    validation.isPublicArticle({ live: {}, publishedAt: "2020-01-01" }),
    true,
  );
});
test("reading time, heading IDs and metadata are deterministic", () => {
  const doc = {
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [text("Care")] },
      { type: "heading", attrs: { level: 3 }, content: [text("Care")] },
      { type: "paragraph", content: [text("word ".repeat(500))] },
    ],
  };
  assert.equal(content.readingMinutes(doc), 3);
  assert.deepEqual(
    content.articleHeadings(doc).map((h) => h.id),
    ["care", "care-2"],
  );
  const meta = seo.pageMetadata("Title", "Description", "/blog/a");
  assert.equal(
    meta.alternates.canonical,
    "https://www.craftingcorner.in/blog/a",
  );
  assert.equal(meta.openGraph.title, "Title");
  assert.ok(
    !seo.jsonLd({ title: "</script><script>evil</script>" }).includes("<"),
  );
});
