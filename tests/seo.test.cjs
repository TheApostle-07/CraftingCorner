const assert = require("node:assert/strict");
const { test } = require("node:test");
const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { readModule, root } = require("../scripts/blog-runtime.cjs");

const { absoluteUrl, articleCanonical, escapeXml, pageMetadata } = readModule(
  path.join(root, "src/lib/seo.ts"),
);
const { POST } = readModule(
  path.join(root, "src/app/api/analytics/conversion/route.ts"),
);

test("canonical URLs, search directives and image sitemap URLs use distinct encodings", () => {
  const metadata = pageMetadata(
    "Catalogue",
    "Furniture in Mohali",
    "/products",
    undefined,
    true,
  );
  assert.equal(metadata.alternates.canonical, absoluteUrl("/products"));
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(articleCanonical("a-room"), absoluteUrl("/blog/a-room"));
  assert.equal(
    articleCanonical("a-room", "https://example.com/story"),
    "https://example.com/story",
  );
  assert.equal(
    escapeXml("https://example.com/room.webp?w=900&q=81"),
    "https://example.com/room.webp?w=900&amp;q=81",
  );
});

test("conversion relay only forwards allowed anonymous event fields", async (t) => {
  const oldId = process.env.GA4_MEASUREMENT_ID;
  const oldSecret = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET;
  t.after(() => {
    if (oldId === undefined) delete process.env.GA4_MEASUREMENT_ID;
    else process.env.GA4_MEASUREMENT_ID = oldId;
    if (oldSecret === undefined)
      delete process.env.GA4_MEASUREMENT_PROTOCOL_SECRET;
    else process.env.GA4_MEASUREMENT_PROTOCOL_SECRET = oldSecret;
  });
  delete process.env.GA4_MEASUREMENT_ID;
  delete process.env.GA4_MEASUREMENT_PROTOCOL_SECRET;

  const request = (body, site = "same-origin") =>
    new Request(absoluteUrl("/api/analytics/conversion"), {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: JSON.stringify(body),
    });
  const clientId = randomUUID();
  const click = { event: "whatsapp_click", clientId };
  assert.equal((await POST(request(click))).status, 404);
  process.env.GA4_MEASUREMENT_ID = "G-TEST123";
  process.env.GA4_MEASUREMENT_PROTOCOL_SECRET = "test-only";
  const upstream = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 204 }),
  );
  assert.equal((await POST(request(click, "cross-site"))).status, 403);
  assert.equal(
    (await POST(request({ ...click, phone: "private" }))).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...click, clientId: "x".repeat(600) }))).status,
    413,
  );
  assert.equal(upstream.mock.callCount(), 0);
  assert.equal((await POST(request(click))).status, 204);
  assert.equal(
    (
      await POST(
        request({ event: "generate_lead", clientId, formKind: "contact" }),
      )
    ).status,
    204,
  );
  assert.deepEqual(
    upstream.mock.calls.map(({ arguments: [url, options] }) => ({
      url: url.origin + url.pathname,
      payload: JSON.parse(options.body),
    })),
    [
      {
        url: "https://www.google-analytics.com/mp/collect",
        payload: {
          client_id: clientId,
          consent: { ad_user_data: "DENIED", ad_personalization: "DENIED" },
          events: [{ name: "whatsapp_click", params: {} }],
        },
      },
      {
        url: "https://www.google-analytics.com/mp/collect",
        payload: {
          client_id: clientId,
          consent: { ad_user_data: "DENIED", ad_personalization: "DENIED" },
          events: [{ name: "generate_lead", params: { form_kind: "contact" } }],
        },
      },
    ],
  );
});
