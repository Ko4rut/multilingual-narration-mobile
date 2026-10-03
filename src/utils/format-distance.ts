/** Định dạng khoảng cách bằng mét hoặc kilomet cho UI. */
export function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1_000) {
    return `${distanceMeters}m`;
  }

  return `${(distanceMeters / 1_000).toFixed(1)}km`;
}
