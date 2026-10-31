/** Add a native vector archive as an Expo/Metro asset. */
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes("pmtiles")) {
  config.resolver.assetExts.push("pmtiles");
}
module.exports = config;
