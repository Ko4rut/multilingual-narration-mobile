/**
 * Download SHA-verified Noto Sans PBF glyphs used for offline Vietnamese map labels.
 * Assets originate from protomaps/basemaps-assets. Internet is used only at build time.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(root, "assets", "glyphs", "Noto Sans Regular");
const upstream = "028c18f713baecad011301ff7a69acc39bcc2ae7";
const expected = [
  ["0-255", 76044, "7f65901599b368dc8c1d70d5fed9642148db9836"],
  ["256-511", 127726, "f0302889321b2fb9f83e13b5df1a9a6b0b10e6f3"],
  ["512-767", 94728, "5cde89d339b3cf0be2039f376fe20cadc75e533e"],
  ["768-1023", 77034, "a1d0bd9140db88a231ba88991e3d3e2191387448"],
  ["7680-7935", 135449, "12a451502bd7832dd1ef5de80e1b272ed49418db"],
  ["7936-8191", 128630, "8900e1b932b951bb6c0749d2a4b91c4307a37e5a"],
  ["8192-8447", 64220, "9d7bcf0e89f0d1605c5b5cc75960f6deac70d18e"],
];
const base = "https://raw.githubusercontent.com/protomaps/basemaps-assets/" + upstream + "/fonts";
mkdirSync(destination, { recursive: true });
const manifest = { source: "protomaps/basemaps-assets", commit: upstream, fontstack: "Noto Sans Regular", files: [] };

for (const [range, size, gitSha] of expected) {
  const filename = range + ".pbf";
  const path = join(destination, filename);
  let buffer;
  if (existsSync(path)) {
    buffer = readFileSync(path);
  } else {
    const url = base + "/Noto%20Sans%20Regular/" + filename;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(filename + " HTTP " + response.status);
    buffer = Buffer.from(await response.arrayBuffer());
  }
  const actualSha = createHash("sha1").update("blob " + buffer.length + "\0").update(buffer).digest("hex");
  if (buffer.length !== size || actualSha !== gitSha) {
    throw new Error(filename + " failed size/Git SHA validation: bytes=" + buffer.length + ", sha=" + actualSha);
  }
  writeFileSync(path, buffer);
  manifest.files.push({ name: filename, sizeBytes: size, sha256: createHash("sha256").update(buffer).digest("hex") });
  console.log(filename, size, "bytes");
}
const licensePath = join(root, "assets", "glyphs", "OFL.txt");
if (!existsSync(licensePath)) {
  const response = await fetch(base + "/OFL.txt", { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error("Font license HTTP " + response.status);
  const license = await response.text();
  if (!license.includes("SIL OPEN FONT LICENSE")) throw new Error("Unexpected font license");
  writeFileSync(licensePath, license, "utf8");
}
writeFileSync(join(root, "assets", "glyphs", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("Verified", manifest.files.length, "offline glyph ranges.");
