# Bundled HCMC offline basemap — Android MVP

This supersedes the first-launch network download in PR #11. The Android app uses a native PMTiles asset, not OfflineManager or a SQLite tile store.

Coverage rectangle (W,S,E,N): [106.55, 10.66, 106.83, 10.88]. Center: [106.69, 10.77].
This approximates a larger HCMC central area, including former Districts 5, 8, 10 and neighbors. It is not an administrative polygon.

## Generate and build

Requires Docker, Node 22 and an Internet connection during development/build.

1. Execute: node scripts/build-hcm-pmtiles.mjs
2. Verify that assets/maps/hcm-metropolitan.pmtiles and assets/maps/hcm-metropolitan.manifest.json exist.
3. Execute: npx expo run:android
4. The Expo config plugin verifies the archive hash and installs it under android/app/src/main/assets.
5. MapLibre Native reads pmtiles://asset://hcm-metropolitan.pmtiles, directly from the installed app.

Generator source is a pinned Protomaps planet build, using zooms 0-15; z16 is overzoomed. Override with PROTOMAPS_BUILD_URL if needed. Generated archive above 95 MiB is rejected, to avoid GitHub blob size limit. GitHub Actions workflow may generate and commit the archive if repository permissions allow it; never merge a PR without both real files. The pipeline downloads from Protomaps, NOT from tile.openstreetmap.org.

## Offline limitations and testing

Basic local vector style renders water, parkland, roads and buildings only: no glyphs, street-name labels, sprites, routing, POI content or audio yet. It has no external URL dependencies.

Test in Android development build: first install, force stop, enable airplane mode, relaunch, pan and zoom around former Districts 5/8/10, deny GPS and verify display, check app size and map attribution. This feature requires an Android MapLibre Native version supporting pmtiles://asset:// sources.

Basemap derived from OpenStreetMap/Natural Earth by Protomaps. Attribute © OpenStreetMap contributors and Protomaps. Review ODbL Produced Work terms before distribution.
