/** Fixture ngôn ngữ và chất lượng audio cho Settings picker. */
import type {
  AudioQualityOption,
  LanguageOption,
} from "../types/settings.types";

// Danh sách ngôn ngữ giả lập để thay thế bằng dữ liệu API sau này.
export const MOCK_LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "english", code: "en", label: "English", nativeLabel: "English" },
  { id: "vietnamese", code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { id: "french", code: "fr", label: "French", nativeLabel: "Français" },
  { id: "japanese", code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { id: "korean", code: "ko", label: "Korean", nativeLabel: "한국어" },
  { id: "chinese", code: "zh-CN", label: "Chinese", nativeLabel: "简体中文" },
  { id: "spanish", code: "es", label: "Spanish", nativeLabel: "Español" },
  { id: "german", code: "de", label: "German", nativeLabel: "Deutsch" },
];

// Các mức chất lượng giả lập, sắp xếp từ tiết kiệm dữ liệu đến cao nhất.
export const MOCK_AUDIO_QUALITY_OPTIONS: AudioQualityOption[] = [
  {
    id: "data-saver",
    label: "Data Saver (64kbps)",
    bitrateKbps: 64,
    description: "Uses less mobile data.",
  },
  {
    id: "standard",
    label: "Standard (128kbps)",
    bitrateKbps: 128,
    description: "Balanced quality and data usage.",
  },
  {
    id: "high",
    label: "High (320kbps)",
    bitrateKbps: 320,
    description: "Clear audio with higher data usage.",
  },
  {
    id: "lossless",
    label: "Lossless (1412kbps)",
    bitrateKbps: 1412,
    description: "Best available narration quality.",
  },
];
