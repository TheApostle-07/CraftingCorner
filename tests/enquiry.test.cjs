const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const { readModule, root } = require("../scripts/blog-runtime.cjs");

const { POST } = readModule(path.join(root, "src/app/api/enquiry/route.ts"));
const callback = {
  kind: "callback",
  name: "Example Visitor",
  email: "visitor@example.com",
  phone: "+91 90000 00000",
  submissionId: "74c3ecbf-ff54-4898-aefc-054c61b80c01",
};

function enquiry(payload, headers = {}) {
  return new Request("https://www.craftingcorner.in/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
}

test("callback submissions preserve the retry ID and the Apps Script encoding", async (t) => {
  const receiver = t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.ok(options.body instanceof URLSearchParams);
    assert.equal(options.body.get("source"), "callback");
    assert.equal(options.body.get("phone"), callback.phone);
    assert.equal(options.body.get("submissionId"), callback.submissionId);
    assert.match(options.body.get("message"), /Callback requested/);
    return Response.json({ ok: true });
  });
  const result = await POST(enquiry(callback));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(receiver.mock.callCount(), 1);
});

test("contact requests keep the message, escape sheet formulas and allow an empty phone", async (t) => {
  const receiver = t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.body.get("source"), "contact");
    assert.equal(options.body.get("phone"), "");
    assert.equal(options.body.get("message"), "'=SUM(1, 2)");
    return Response.json({ ok: true });
  });
  const result = await POST(
    enquiry({ ...callback, kind: "contact", phone: "", message: "=SUM(1, 2)" }),
  );
  assert.equal(result.status, 200);
  assert.equal(receiver.mock.callCount(), 1);
});

test("an Apps Script error page or a rejected write cannot show success", async (t) => {
  const receiver = t.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response("<title>Error</title>", {
        headers: { "Content-Type": "text/html" },
      }),
  );
  assert.equal((await POST(enquiry(callback))).status, 502);
  receiver.mock.mockImplementation(async () => Response.json({ ok: false }));
  assert.equal((await POST(enquiry(callback))).status, 502);
});

test("invalid callback details, cross-origin and oversized requests never reach Sheets", async (t) => {
  const receiver = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ ok: true }),
  );
  assert.equal(
    (await POST(enquiry({ ...callback, phone: "(((())))" }))).status,
    400,
  );
  assert.equal(
    (await POST(enquiry({ ...callback, website: "spam" }))).status,
    400,
  );
  assert.equal(
    (await POST(enquiry({ ...callback, kind: "contact" }))).status,
    400,
  );
  assert.equal(
    (await POST(enquiry(callback, { Origin: "https://example.com" }))).status,
    403,
  );
  assert.equal(
    (await POST(enquiry({ ...callback, padding: "x".repeat(25000) }))).status,
    413,
  );
  assert.equal(receiver.mock.callCount(), 0);
});

test("accepts the browser's same-origin host when Next.js normalises its URL", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ ok: true }));
  const request = new Request("http://localhost:3011/api/enquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Host: "127.0.0.1:3011",
      Origin: "http://127.0.0.1:3011",
    },
    body: JSON.stringify(callback),
  });
  assert.equal((await POST(request)).status, 200);
});
