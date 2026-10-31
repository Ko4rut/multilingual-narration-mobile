/**
 * Phạm vi dữ liệu bản đồ đóng gói trong PMTiles.
 *
 * Tọa độ theo thứ tự [tây, nam, đông, bắc].
 * Đây là hình chữ nhật địa lý, không phải ranh giới hành chính các quận.
 */
export const REQUIRED_OFFLINE_MAP = {
  key: "hcm-metropolitan-bundled",
  version: 2,
  name: "TP.HCM: Quận 5, 8, 10 và khu vực trung tâm",
  bounds: [106.55, 10.66, 106.83, 10.88] as [number, number, number, number],
  center: [106.69, 10.77] as [number, number],
  minZoom: 10,
  maxZoom: 16,
} as const;

/** Vị trí GPS bên ngoài gói PMTiles không được dùng để đưa camera ra ngoài vùng. */
export function isWithinRequiredMap(latitude: number, longitude: number): boolean {
  const [west, south, east, north] = REQUIRED_OFFLINE_MAP.bounds;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }

  if (longitude < west || longitude > east) {
    return false;
  }

  if (latitude < south || latitude > north) {
    return false;
  }

  return true;
}
