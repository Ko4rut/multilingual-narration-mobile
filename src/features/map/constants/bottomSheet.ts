/** Cấu hình kích thước, ngưỡng gesture và spring của map bottom sheet. */
export const BOTTOM_SHEET_COLLAPSED_HEIGHT = 28;
export const BOTTOM_SHEET_EXPANDED_HEIGHT_RATIO = 0.54;
export const BOTTOM_SHEET_VELOCITY_THRESHOLD = 500;

export const BOTTOM_SHEET_SPRING_CONFIG = {
  damping: 22,
  stiffness: 240,
  mass: 0.85,
} as const;
