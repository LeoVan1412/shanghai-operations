"use strict";
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
const { root, sha, build } = require("./build");
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function zip(files) {
  const local = [], central = [];
  let offset = 0;
  for (const [name, bytes] of files) {
    const nameBytes = Buffer.from(name), compressed = zlib.deflateRawSync(bytes, { level: 9 });
    const crc = crc32(bytes);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8);
    header.writeUInt16LE(0x21, 12); header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(bytes.length, 22);
    header.writeUInt16LE(nameBytes.length, 26);
    local.push(header, nameBytes, compressed);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0); directory.writeUInt16LE(0x0314, 4);
    directory.writeUInt16LE(20, 6); directory.writeUInt16LE(0x800, 8); directory.writeUInt16LE(8, 10);
    directory.writeUInt16LE(0x21, 14); directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(compressed.length, 20); directory.writeUInt32LE(bytes.length, 24);
    directory.writeUInt16LE(nameBytes.length, 28); directory.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, nameBytes);
    offset += header.length + nameBytes.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.size, 8);
  end.writeUInt16LE(files.size, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
function packageReview() {
  const result = build();
  const name = "Shanghai-Operations-" + result.manifest.version + "-review.zip";
  const bytes = zip(result.files), directory = path.join(root, "review-package");
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, name), bytes);
  fs.writeFileSync(path.join(directory, "SHA256SUMS.txt"), sha(bytes) + "  " + name + "\n");
  fs.writeFileSync(path.join(root, "dist/SHA256SUMS-mod.txt"), [...result.files].map(([n, b]) => sha(b) + "  " + n).join("\n") + "\n");
  console.log(JSON.stringify({ file: "review-package/" + name, bytes: bytes.length, sha256: sha(bytes), runtimeSHA256: result.runtimeSHA256 }));
  return { ...result, name, bytes };
}
if (require.main === module) packageReview();
module.exports = { crc32, zip, packageReview };
