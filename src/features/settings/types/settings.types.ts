/** Các kiểu dữ liệu được chia sẻ trong feature Settings. */
export type SettingsPickerOption = {
  id: string;
  label: string;
};

export type LanguageOption = SettingsPickerOption & {
  code: string;
  nativeLabel: string;
};

export type AudioQualityOption = SettingsPickerOption & {
  bitrateKbps: number;
  description: string;
};
