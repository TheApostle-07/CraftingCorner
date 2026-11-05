// Small TypeScript runner for maintenance and Node's test runner; no separate ORM.
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const modules = new Map();
function readModule(file) {
  if (modules.has(file)) return modules.get(file).exports;
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
  const module = { exports: {} };
  modules.set(file, module);
  const localRequire = (name) => {
    if (name === "react") return { ...require("react"), cache: (fn) => fn };
    if (!name.startsWith(".") && !name.startsWith("@/")) return require(name);
    let target = name.startsWith("@/")
      ? path.join(root, "src", name.slice(2))
      : path.resolve(path.dirname(file), name);
    if (!path.extname(target)) target += ".ts";
    return readModule(target);
  };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("require", "module", "exports", source)(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}
module.exports = { readModule, root };
