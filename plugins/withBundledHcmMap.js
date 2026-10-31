/** Copy verified prebuilt PMTiles to native Android assets during Expo prebuild. */
const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
module.exports = (config) => withDangerousMod(config, ["android", async (config) => {
  const root = config.modRequest.projectRoot;
  const file = path.join(root, "assets/maps/hcm-metropolitan.pmtiles");
  const manifest = path.join(root, "assets/maps/hcm-metropolitan.manifest.json");
  if (!fs.existsSync(file) || !fs.existsSync(manifest))
    throw new Error("Missing bundled HCMC map. Run node scripts/build-hcm-pmtiles.mjs before expo run:android.");
  const expected = JSON.parse(fs.readFileSync(manifest, "utf8"));
  const actual = createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (actual !== expected.sha256 || fs.statSync(file).size !== expected.sizeBytes)
    throw new Error("Bundled HCMC map failed SHA-256 / size verification.");
  const dest = path.join(root, "android/app/src/main/assets");
  fs.mkdirSync(dest, { recursive: true });
  fs.copyFileSync(file, path.join(dest, "hcm-metropolitan.pmtiles"));
  return config;
}]);
