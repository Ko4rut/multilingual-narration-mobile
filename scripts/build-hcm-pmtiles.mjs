/**
 * Extract a distributable HCMC vector PMTiles basemap from a Protomaps build.
 * Requires Docker Desktop/Engine; no request is made to tile.openstreetmap.org.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, openSync, readSync, closeSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(repositoryRoot, "assets", "maps");
const filePath = join(outputDirectory, "hcm-metropolitan.pmtiles");
const manifestPath = join(outputDirectory, "hcm-metropolitan.manifest.json");
const source = process.env.PROTOMAPS_BUILD_URL || "https://build.protomaps.com/20261012.pmtiles";

// Approximate bounding box, not an official set of administrative boundaries.
// Includes former Districts 5, 8, 10 and nearby central districts.
const bounds = [106.55, 10.66, 106.83, 10.88];
const archiveMaxZoom = 15; // Protomaps v4 basemap: overzoom z15 tiles at map zoom 16.
const maxBytes = 95 * 1024 * 1024; // Keep under GitHub's 100 MiB per-blob limit.

mkdirSync(outputDirectory, { recursive: true });
if (!existsSync(filePath) || process.env.FORCE_MAP_REBUILD === "1") {
  const args = [
    "run", "--rm",
    "--mount", "type=bind,source=" + outputDirectory + ",target=/data",
    "ghcr.io/protomaps/go-pmtiles:v1.31.2",
    "extract", source, "/data/hcm-metropolitan.pmtiles",
    "--bbox=" + bounds.join(","),
    "--maxzoom=" + archiveMaxZoom,
    "--download-threads=6",
  ];
  console.log("Extracting HCMC PMTiles from:", source);
  const result = spawnSync("docker", args, { stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("PMTiles extraction failed: " + result.status);
}

if (!existsSync(filePath)) throw new Error("Map archive was not created: " + filePath);
const bytes = statSync(filePath).size;
if (bytes < 127 || bytes > maxBytes) {
  throw new Error("Unexpected PMTiles size: " + bytes + " bytes. Adjust zoom/bounds or distribute separately.");
}
const fd = openSync(filePath, "r");
const magic = Buffer.alloc(7);
try { readSync(fd, magic, 0, 7, 0); } finally { closeSync(fd); }
if (magic.toString("utf8") !== "PMTiles") {
  throw new Error("Downloaded data does not have the PMTiles v3 magic header.");
}

const hash = createHash("sha256");
for await (const chunk of createReadStream(filePath)) hash.update(chunk);
const manifest = {
  name: "TP.HCM — Quận 5, 8, 10 và các quận trung tâm lân cận",
  bounds,
  center: [106.69, 10.77],
  minZoom: 0,
  maxZoom: archiveMaxZoom,
  displayMaxZoom: 16,
  sizeBytes: bytes,
  sha256: hash.digest("hex"),
  source,
  dataAttribution: "© OpenStreetMap contributors; Protomaps basemap",
};
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Created:", filePath, bytes, "bytes");
console.log("SHA-256:", manifest.sha256);
