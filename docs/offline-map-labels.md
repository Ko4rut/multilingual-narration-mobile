# Offline Vietnamese map labels

Adds road/place/water/landuse/POI symbol layers to the existing HCMC Protomaps v4 PMTiles archive.
Uses seven Noto Sans Regular glyph ranges pinned to protomaps/basemaps-assets commit 028c18f713baecad011301ff7a69acc39bcc2ae7.
Glyphs are verified at build time and embedded by Metro; at startup, Expo FileSystem copies them into app documents.
Native MapLibre glyph URL uses file:///.../offline-map-glyphs/{fontstack}/{range}.pbf.
Fallback is the name property if name:vi is unavailable. Some POIs are absent from basemap tiles.

Build: git pull, npm ci, npx expo start --clear, npx expo run:android.
Test text rendering and diacritics at zoom 13-16 in Districts 5, 8 and 10.
Test fresh release installation with airplane mode (dev-client initially relies on Metro).
Font license: assets/glyphs/OFL.txt (SIL Open Font License). Map © OSM contributors / Protomaps.
