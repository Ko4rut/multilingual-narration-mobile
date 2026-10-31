/** Add a native vector archive as an Expo/Metro asset. */
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
for (const ext of ["pmtiles", "pbf"]) {
  if (!config.resolver.assetExts.includes(ext)) config.resolver.assetExts.push(ext);
}
module.exports = config;
