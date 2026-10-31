# Refactor: Android offline map pipeline

## Scope
The release APK bundles PMTiles and nine Noto Sans PBF glyph ranges. This does not include full offline audio, POIs or images.

## Runtime flow
1. RootLayout runs useStartup and useOfflineResources independently.
2. The offline hook prepares PMTiles and Noto Sans glyphs concurrently.
3. Both services delegate safe file installation to prepareBundledAsset.
4. Existing files are reused only after validation. Missing/broken files are replaced from the assets included in the APK.
5. Files are copied to a temporary .partial file, then moved into place.
6. MapLibre uses the resulting pmtiles://file:// path and local font file:// template.
7. OfflineScreen shows the installed map/font status rather than a hardcoded success claim.

## Important file-operation rule
Expo File.move() MUTATES the source File URI. Deleting that object in finally would delete the installed map. Cleanup uses the original temporary URI.

## Recovery and integrity
- Concurrent callers share one promise and a failed promise can be retried.
- PMTiles filenames include the manifest checksum prefix to distinguish versions.
- PMTiles validation checks size and seven magic-header bytes, but full SHA-256 is verified only when creating the archive.
- Glyph validation checks each file size; the included ranges are not a complete Unicode set.
- Old map versions are not automatically removed until a deliberate storage migration is implemented.
- Startup is designed to work without Internet on a release build, not necessarily a Metro-dependent development client.

## Manual Android test
1. npm ci && npx tsc --noEmit
2. Build release APK, install, disable network BEFORE first launch.
3. Confirm roads, water, buildings and Vietnamese labels around Districts 5, 8 and 10.
4. Deny GPS permission and confirm map still loads.
5. Check camera bounds and zoom limits.
6. Force-stop, relaunch without network.
7. Check offline screen reports ready, installed size and nine glyph files.
8. Upgrade APK, check no errors, then test no data/wiped installation.

Code conventions: descriptive named functions, no ternary operators, comments explaining non-obvious behavior.
