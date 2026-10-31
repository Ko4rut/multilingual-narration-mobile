/** A fixed pilot rectangle, not administrative districts. */
export const REQUIRED_OFFLINE_MAP = {
  key: "hcm-metropolitan-bundled",
  version: 2,
  name: "TP.HCM: Quận 5, 8, 10 và khu vực trung tâm",
  bounds: [106.55, 10.66, 106.83, 10.88] as [number, number, number, number],
  center: [106.69, 10.77] as [number, number],
  minZoom: 10,
  maxZoom: 16,
} as const;
export function isWithinRequiredMap(latitude: number, longitude: number): boolean {
  const [west, south, east, north] = REQUIRED_OFFLINE_MAP.bounds;
  return longitude >= west && longitude <= east && latitude >= south && latitude <= north;
}
