"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
const { root, sha, build } = require("./build");
const { crc32, zip } = require("./package");
const result = build();
const provenance = JSON.parse(fs.readFileSync(path.join(root, "evidence/extraction-2026-10-15.json")));
const versionDeclaration = 'const VERSION = "' + result.manifest.version + '";';
const originalVersionDeclaration = 'const VERSION = "' + provenance.modVersion + '";';
const restoreOriginalVersion = bytes => Buffer.from(bytes.toString("utf8").replace(versionDeclaration, originalVersionDeclaration));
assert.equal(sha(restoreOriginalVersion(result.files.get("index.js"))), provenance.runtimeSHA256,
  "Runtime changes beyond the version declaration require new acceptance evidence");
assert.equal(result.manifest.id, "leovan-shanghai-operations");
assert.equal(result.manifest.repository, "https://github.com/LeoVan1412/shanghai-operations");
for (const entry of provenance.copiedFiles) {
  if (entry.destination === "source/operations-mod/manifest.json" || entry.destination.startsWith("docs/")) continue;
  const bytes = fs.readFileSync(path.join(root, entry.destination));
  assert.equal(sha(entry.destination === "source/operations-mod/index.js" ? restoreOriginalVersion(bytes) : bytes), entry.sha256, entry.destination);
}
assert.equal(sha(fs.readFileSync(path.join(root, "source/operations-mod/expansion-boundaries.js"))), provenance.boundaryAssetSHA256);
const name = "Shanghai-Operations-" + result.manifest.version + "-review.zip";
const archive = fs.readFileSync(path.join(root, "review-package", name));
assert(archive.equals(zip(result.files)), "ZIP is not the reproducible current package");
const names = [], extracted = new Map();
let offset = 0;
while (archive.readUInt32LE(offset) === 0x04034b50) {
  assert.equal(archive.readUInt16LE(offset + 8), 8);
  const size = archive.readUInt32LE(offset + 18), rawSize = archive.readUInt32LE(offset + 22);
  const nameLength = archive.readUInt16LE(offset + 26), extra = archive.readUInt16LE(offset + 28);
  const filename = archive.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
  assert(!filename.includes("/") && !filename.includes("\\") && !names.includes(filename));
  const start = offset + 30 + nameLength + extra;
  const bytes = zlib.inflateRawSync(archive.subarray(start, start + size));
  assert.equal(bytes.length, rawSize); assert.equal(crc32(bytes), archive.readUInt32LE(offset + 14));
  assert(result.files.has(filename) && bytes.equals(result.files.get(filename)), filename);
  names.push(filename); extracted.set(filename, bytes); offset = start + size;
}
assert.deepEqual(names, [...result.files.keys()]);
assert.equal(archive.readUInt32LE(offset), 0x02014b50);
assert.equal(sha(extracted.get("index.js")), result.runtimeSHA256);
assert.equal(JSON.parse(extracted.get("manifest.json")).version, result.manifest.version);
const checksumLine = sha(archive) + "  " + name + "\n";
assert.equal(fs.readFileSync(path.join(root, "review-package/SHA256SUMS.txt"), "utf8"), checksumLine);
for (const [filename, bytes] of result.files) {
  assert(!/\/Users\/|\/Volumes\/|TemporaryItems|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}/.test(bytes.toString()), "Private material in " + filename);
}
const tests = JSON.parse(fs.readFileSync(path.join(root, "dist/offline-tests.json")));
assert(tests.passed && tests.tests.length === 7 && tests.tests.every(t => t.passed));
const report = {
  schemaVersion: 1, date: new Date().toISOString().slice(0, 10), modVersion: result.manifest.version,
  scope: "Registry-compatible version packaging and synthetic regression only",
  runtimeSHA256: result.runtimeSHA256, runtimeUnchangedFromR16: result.runtimeSHA256 === provenance.runtimeSHA256,
  runtimeUnchangedExceptVersionFromR16: true, normalizedRuntimeSHA256: provenance.runtimeSHA256,
  originalModIdPreserved: true,
  zipFile: "review-package/" + name, zipSHA256: sha(archive), zipBytes: archive.length,
  archiveFiles: names, deterministicArchive: true, offlineRegression: tests,
  newLoadedGameAcceptance: false, publishReady: false,
  note: "Only the runtime version declaration, package metadata and documentation changed. Registry listing approval is separate from full gameplay acceptance. No new game feature or map-data improvement is claimed."
};
fs.writeFileSync(path.join(root, "evidence/standalone-validation-" + report.date + ".json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
