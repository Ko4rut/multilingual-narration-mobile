/** Giá trị mặc định và thông tin tĩnh của màn hình Settings. */
export const DEFAULT_SETTINGS_PREFERENCES = {
  audioQualityId: "high",
  autoplayEnabled: true,
  languageId: "english",
} as const;

export const APP_VERSION_LABEL = "v2.4.1 (Stable)";

export const SETTINGS_PICKER_COPY = {
  language: {
    accessibilityLabel: "language picker",
    description: "Select the language used for narration and transcripts.",
    title: "Choose Language",
  },
  audioQuality: {
    accessibilityLabel: "audio quality picker",
    description: "Select the streaming quality used for narration audio.",
    title: "Choose Audio Quality",
  },
} as const;

export const VOICE_PARTNERS_ALERT = {
  message: "Voice partner information will be available here.",
  title: "Narration Voice Partners",
} as const;
