"use strict";
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const source = path.join(root, "source/operations-mod");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function build() {
  const manifest = JSON.parse(fs.readFileSync(path.join(source, "manifest.json")));
  const project = JSON.parse(fs.readFileSync(path.join(root, "package.json")));
  if (manifest.version !== project.version) throw Error("Project and mod versions differ");
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw Error("Railyard release versions must use X.Y.Z");
  const runtime = fs.readFileSync(path.join(source, "index.js"), "utf8");
  if (!runtime.includes('const VERSION = "' + manifest.version + '";')) throw Error("Runtime and mod versions differ");
  const bytes = Buffer.concat([
    fs.readFileSync(path.join(source, "dispatch-core.js")), Buffer.from("\n"),
    fs.readFileSync(path.join(source, "expansion-core.js")),
    fs.readFileSync(path.join(source, "expansion-boundaries.js")),
    fs.readFileSync(path.join(source, "index.js"))
  ]);
  const files = new Map([
    ["manifest.json", Buffer.from(JSON.stringify(manifest, null, 2) + "\n")],
    ["index.js", bytes],
    ["README.md", Buffer.from(fs.readFileSync(path.join(root, "docs/PLAYER_GUIDE.md"), "utf8")
      .replaceAll("](LEGACY_CAPABILITIES_2026-10-01.md)", "](https://github.com/LeoVan1412/shanghai-operations/blob/main/docs/LEGACY_CAPABILITIES_2026-10-01.md)")
      .replaceAll("](ACCEPTANCE_STATUS.md)", "](https://github.com/LeoVan1412/shanghai-operations/blob/main/docs/ACCEPTANCE_STATUS.md)"))],
    ["LICENSE", fs.readFileSync(path.join(root, "LICENSE"))],
    ["LICENSE-DATA.md", fs.readFileSync(path.join(root, "LICENSE-DATA.md"))]
  ]);
  const output = path.join(root, "dist/mod");
  fs.mkdirSync(output, { recursive: true });
  for (const [name, content] of files) fs.writeFileSync(path.join(output, name), content);
  return { manifest, files, runtimeSHA256: sha(bytes) };
}
if (require.main === module) {
  const result = build();
  console.log(JSON.stringify({ version: result.manifest.version, files: [...result.files.keys()], runtimeSHA256: result.runtimeSHA256 }));
}
module.exports = { root, sha, build };
