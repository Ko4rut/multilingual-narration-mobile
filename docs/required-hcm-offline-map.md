# Required HCMC offline map (mobile MVP)

The first app launch is blocked until a MapLibre native offline pack has finished downloading. The downloaded map is a fixed **pilot footprint**, not a precise administrative boundary:

- `[west, south, east, north]`: `[106.61, 10.68, 106.79, 10.86]`
- zoom `11..16`
- center `[106.70, 10.77]`

## Required provider configuration

The existing `tile.openstreetmap.org` raster endpoint **must not** be used for bulk offline downloads (see https://operations.osmfoundation.org/policies/tiles/).

Supply an HTTPS MapLibre style endpoint whose **provider explicitly permits offline/prefetch** for this footprint and zoom range, including all referenced tile, glyph, and sprite URLs:

```powershell
# PowerShell example (replace URL with your permitted, working style URL)
$env:EXPO_PUBLIC_OFFLINE_MAP_STYLE_URL="https://your-authorized-tile-host.example/styles/hcm/style.json"
npx expo start --clear
```

For permanent local configuration, put `EXPO_PUBLIC_OFFLINE_MAP_STYLE_URL` in an ignored `.env.local` file and restart Metro. Do not put secret provider credentials in an EXPO_PUBLIC variable: these values are visible in the client bundle. If your provider uses public keys/tokens, restrict them to the intended application and usage.

**No provider is bundled or auto-selected.** Without this setting, the first-launch screen reports a configuration error rather than silently bulk downloading from OpenStreetMap.

## Flow

1. Splash loads fonts/images (does not await a network download).
2. Root checks `OfflineManager.getPacks()`, matches package metadata (key, version, style URL, and bounds), and asks MapLibre for the pack's native status.
3. A pack whose status is `complete` unlocks navigation. Incomplete packs are subscribed to and resumed; missing packs are created with the same style URL that the map view uses.
4. Download progress or failures appear on the non-skippable setup screen. Retry reattaches to the existing native pack instead of creating a duplicate.
5. The Map tab renders without GPS permission, and does not auto-pan outside the downloaded footprint.

The tiles live in MapLibre's native offline database. This MVP does **not** add `expo-sqlite`; that is appropriate later for POI/narration metadata. Offline narration/audio are not part of this change.

## Manual acceptance checklist (Android development build)

- Set an approved style URL and confirm its provider download limits/terms before trying a download.
- First launch: progress appears, map must finish before the main tabs show.
- Force-close midway: restart and verify existing pack resumes rather than duplicating.
- Disable network midway: see failure or stalled progress; retry after reconnecting.
- Close/relaunch with pack complete and airplane mode enabled: tabs unlock, map displays within bounds at zoom 11–16.
- Deny GPS permission: map should still render.
- Clear app data: first-launch download is required again.
- Change map style/version/bounds: previous pack should not satisfy the gate.
- Watch provider download quotas and on-device byte usage before distributing builds.

**Not guaranteed:** downloading while the app is backgrounded or killed. The UI asks users to keep the application open. Real-world offline coverage and resource size must be verified on a device, including provider licensing and performance.
