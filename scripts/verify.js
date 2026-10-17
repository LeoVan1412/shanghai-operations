"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
const { root, sha, build } = require("./build");
const { crc32, zip } = require("./package");
const result = build();
const provenance = JSON.parse(fs.readFileSync(path.join(root, "evidence/extraction-2026-10-15.json")));
assert.equal(result.runtimeSHA256, provenance.runtimeSHA256, "The extraction changed the tested runtime");
assert.equal(result.manifest.id, "leovan-shanghai-operations");
assert.equal(result.manifest.repository, "https://github.com/LeoVan1412/shanghai-operations");
for (const entry of provenance.copiedFiles) {
  if (entry.destination === "source/operations-mod/manifest.json" || entry.destination.startsWith("docs/")) continue;
  assert.equal(sha(fs.readFileSync(path.join(root, entry.destination))), entry.sha256, entry.destination);
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
assert.equal(sha(extracted.get("index.js")), provenance.runtimeSHA256);
for (const [filename, bytes] of result.files) {
  assert(!/\/Users\/|\/Volumes\/|TemporaryItems|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}/.test(bytes.toString()), "Private material in " + filename);
}
const tests = JSON.parse(fs.readFileSync(path.join(root, "dist/offline-tests.json")));
assert(tests.passed && tests.tests.length === 7 && tests.tests.every(t => t.passed));
const report = {
  schemaVersion: 1, date: "2026-10-15", modVersion: result.manifest.version,
  scope: "Independent project extraction, reproducible packaging and synthetic regression only",
  runtimeSHA256: result.runtimeSHA256, runtimeUnchangedFromR16: true,
  codeAndTestSnapshotUnchanged: true, originalModIdPreserved: true,
  zipFile: "review-package/" + name, zipSHA256: sha(archive), zipBytes: archive.length,
  archiveFiles: names, deterministicArchive: true, offlineRegression: tests,
  newLoadedGameAcceptance: false, publishReady: false, communitySubmissionPerformed: false,
  note: "Repository metadata, documentation and separate data attribution changed. No new game feature or map-data improvement is claimed."
};
fs.writeFileSync(path.join(root, "evidence/standalone-validation-2026-10-15.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
