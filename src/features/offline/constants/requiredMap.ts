/** Fixed HCMC pilot footprint; these are geographic bounds, not district borders. */
export const REQUIRED_OFFLINE_MAP = {
  key: "hcm-central",
  version: 1,
  name: "Trung tâm TP. Hồ Chí Minh",
  bounds: [106.61, 10.68, 106.79, 10.86] as [number, number, number, number],
  center: [106.70, 10.77] as [number, number],
  minZoom: 11,
  maxZoom: 16,
} as const;

// Expo replaces direct EXPO_PUBLIC_ references during bundling. Public, non-secret style URL only.
export const OFFLINE_MAP_STYLE_URL =
  process.env.EXPO_PUBLIC_OFFLINE_MAP_STYLE_URL?.trim() ?? "";

export function requireOfflineMapStyleUrl(): string {
  if (!OFFLINE_MAP_STYLE_URL) {
    throw new Error(
      "Chưa cấu hình EXPO_PUBLIC_OFFLINE_MAP_STYLE_URL. Cần nguồn tile được cấp quyền tải offline.",
    );
  }
  if (!/^https:\/\//i.test(OFFLINE_MAP_STYLE_URL)) {
    throw new Error("Nguồn bản đồ offline phải dùng URL HTTPS.");
  }
  if (/tile\.openstreetmap\.org|vector\.openstreetmap\.org/i.test(OFFLINE_MAP_STYLE_URL)) {
    throw new Error("Không thể tải offline từ máy chủ tile công cộng OpenStreetMap.");
  }
  return OFFLINE_MAP_STYLE_URL;
}

export function isWithinRequiredMap(latitude: number, longitude: number): boolean {
  const [west, south, east, north] = REQUIRED_OFFLINE_MAP.bounds;
  return longitude >= west && longitude <= east && latitude >= south && latitude <= north;
}
