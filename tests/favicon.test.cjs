const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");
const sharp = require("sharp");

const pngIcons = [
  ["/favicon.png", 64, "icon"],
  ["/favicon-192.png", 192, "icon"],
  ["/apple-touch-icon.png", 180, "apple-touch-icon"],
];
const icoSizes = [16, 32, 48];

async function verifyPng(bytes, size) {
  assert.ok(bytes.length > 0);
  const image = sharp(bytes);
  const { format, width, height } = await image.metadata();
  assert.deepEqual([format, width, height], ["png", size, size]);
  await image.stats();
}

function verifyIco(bytes) {
  assert.ok(bytes.length > 6 + 16 * icoSizes.length);
  assert.deepEqual([...bytes.subarray(0, 6)], [0, 0, 1, 0, icoSizes.length, 0]);
  for (const [index, size] of icoSizes.entries()) {
    const entry = 6 + index * 16;
    assert.deepEqual([bytes[entry], bytes[entry + 1]], [size, size]);
    const length = bytes.readUInt32LE(entry + 8);
    const offset = bytes.readUInt32LE(entry + 12);
    assert.ok(length > 40 && offset >= 54 && offset + length <= bytes.length);
    assert.equal(bytes.readInt32LE(offset + 4), size);
    assert.equal(bytes.readInt32LE(offset + 8), size * 2);
  }
}

test("the branded icon assets have valid image data and expected dimensions", async () => {
  const load = (url) => readFile(path.join(__dirname, "../public", url));
  for (const [url, size] of pngIcons) await verifyPng(await load(url), size);
  verifyIco(await load("/favicon.ico"));
});

// Set FAVICON_BASE_URL to a running production build to verify the HTTP surface.
const base = process.env.FAVICON_BASE_URL;
test(
  "the storefront serves and declares its public icons",
  { skip: !base },
  async () => {
    async function get(url, userAgent = "Googlebot") {
      const response = await fetch(new URL(url, base), {
        headers: { "User-Agent": userAgent },
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });
      assert.equal(response.status, 200, url);
      return response;
    }

    for (const [url, size] of pngIcons) {
      const response = await get(url, "Googlebot-Image/1.0");
      assert.match(response.headers.get("content-type"), /^image\/png(?:;|$)/);
      await verifyPng(Buffer.from(await response.arrayBuffer()), size);
    }
    const ico = await get("/favicon.ico", "Googlebot-Image/1.0");
    assert.match(
      ico.headers.get("content-type"),
      /^image\/(?:x-icon|vnd\.microsoft\.icon)(?:;|$)/,
    );
    verifyIco(Buffer.from(await ico.arrayBuffer()));

    const sitemap = await (await get("/sitemap.xml")).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, url]) => new URL(url).pathname,
    );
    const pages = new Set(["/", "/products", "/blog", ...urls]);
    const expected = pngIcons
      .map(([url, size, rel]) => [url, `${size}x${size}`, "image/png", rel])
      .sort();
    for (const url of pages) {
      const html = await (await get(url)).text();
      const head = html.slice(0, html.indexOf("</head>"));
      const actual = [...head.matchAll(/<link\b[^>]*>/g)]
        .map(([tag]) =>
          Object.fromEntries(
            [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [
              key,
              value,
            ]),
          ),
        )
        .filter(({ rel }) => rel?.includes("icon"))
        .map(({ href, sizes, type, rel }) => [href, sizes, type, rel])
        .sort();
      assert.deepEqual(actual, expected, url);
    }
  },
);
