# Bundled HCMC offline basemap — Android

This map is included in the release APK/AAB, not downloaded when the app is first installed.
The native MapLibre Android v13.6.1 asset file source cannot reliably read PMTiles byte ranges directly from APK assets, so **do not use** `pmtiles://asset://`.

## Coverage

- Rectangle [west, south, east, north]: [106.55, 10.66, 106.83, 10.88]
- Covers former Districts 5, 8 and 10 and neighboring central areas. This is not an administrative polygon.
- Vector data zoom 0–15, style overzooms at display zoom 16.
- Minimal offline style: roads, water, parks and buildings; no local street-name glyphs or sprites yet.

## Build

- `assets/maps/hcm-metropolitan.pmtiles` (~12.55 MiB) is a verified Protomaps extract.
- `assets/maps/hcm-metropolitan.manifest.json` contains expected bytes and SHA-256.
- `metro.config.js` registers `.pmtiles` as a binary asset extension.
- `expo-asset` resolves a bundled asset. `src/features/offline/services/bundledMap.ts` copies it to `Paths.document/offline-maps/`, checks the copied file size, and returns a `pmtiles://file://...` URL. A completed local copy is reused on subsequent starts.
- No first-run network map download, no native OfflineManager pack, no custom SQLite or Expo native copying plugin.
- Android debug builds serve asset requests via Metro; a truly offline **fresh installation** must be tested using a release APK/AAB with JS assets bundled into the binary.

## Testing

```sh
npm ci
npx expo start --clear
npx expo run:android
```

For a cold start completely offline, create a release app build, install it, then disable Wi-Fi/mobile data **before the first launch**. Inspect map tile rendering in former Districts 5, 8 and 10, GPS-denied behavior, file size, labels and attribution. Keep the PR in draft until the actual Android offline test passes.

## Map data regeneration

`node scripts/build-hcm-pmtiles.mjs` extracts from an available Protomaps planet build; the generated archive and manifest must be committed together. The Android release app must include exactly those bytes. Manifest SHA-256 is checked at archive generation, not on the Android device (Expo FileSystem SDK 57 does not expose File.digest).

© OpenStreetMap contributors · Protomaps. Review applicable map-data attribution and license before release.
