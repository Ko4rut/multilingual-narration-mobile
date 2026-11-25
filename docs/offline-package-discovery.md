# Phase 1 — Offline Package Discovery

The Offline tab preserves the bundled PMTiles/glyph status and adds a read-only
list of **published narration packages**.

## Public Backend APIs

- `GET /api/v1/offline/packages?offset=0&limit=20` — metadata, total and pagination.
- `GET /api/v1/catalog/regions` — region ID and display name.
- `GET /api/v1/catalog/languages` — supported language ID and name.
- `GET /api/v1/catalog/categories` — category ID and display name.

Region, language and category selections are passed as their corresponding
`region_id`, `language_id` and `category_id` query parameters.
The Backend controls the `PUBLISHED` eligibility, not the Mobile UI.

The API origin is resolved through `getApiBaseUrl()` using Settings or
`EXPO_PUBLIC_API_BASE_URL`. For a physical phone, configure a reachable LAN
address or HTTPS host rather than localhost.

## Scope and guarantees

- List, filter, refresh, retry, empty state and pagination only.
- The package size is shown as unknown when Backend `total_size` is null.
- The list indicates server publication, **not** local download readiness.
- Download manager, manifest checksum verification, media storage, version
  switching and offline narration playback belong to later phases.

## Manual test

1. Build/install the development client with `npm run android` if necessary.
2. Run `npm run start:android` and open the Offline tab.
3. Confirm published packages appear; the existing map/storage sections remain.
4. Filter by region, language and optional category. Clear filters and refresh.
5. Try an empty filter result; retry after disconnecting/reconnecting Backend.
6. Check the `Xem thêm gói` control when the response has multiple pages.
