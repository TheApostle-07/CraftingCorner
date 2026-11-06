const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const { readModule, root } = require("../scripts/blog-runtime.cjs");

const { firstSearchParam, searchPage } = readModule(
  path.join(root, "src/lib/searchParams.ts"),
);

test("repeated public search parameters resolve to their first value", () => {
  assert.equal(firstSearchParam([" chair ", "table"]), "chair");
  assert.equal(firstSearchParam([]), "");
  assert.equal(firstSearchParam(undefined), "");
  assert.equal(searchPage(["2", "3"]), 2);
});

test("invalid journal pages fall back to the first page", () => {
  for (const page of [undefined, "", "0", "-4", "1.5", "Infinity", "abc"]) {
    assert.equal(searchPage(page), 1);
  }
});
