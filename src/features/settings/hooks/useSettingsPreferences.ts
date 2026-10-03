/** Quản lý các lựa chọn và trạng thái picker của màn hình Settings. */
import { useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import { DEFAULT_SETTINGS_PREFERENCES } from "../constants/preferences";
import {
  MOCK_AUDIO_QUALITY_OPTIONS,
  MOCK_LANGUAGE_OPTIONS,
} from "../data/mock-settings-options";
import type {
  AudioQualityOption,
  LanguageOption,
} from "../types/settings.types";

function findLanguageById(languageId: string) {
  return (
    MOCK_LANGUAGE_OPTIONS.find((language) => language.id === languageId) ??
    MOCK_LANGUAGE_OPTIONS.find(
      (language) => language.id === DEFAULT_SETTINGS_PREFERENCES.languageId,
    ) ??
    MOCK_LANGUAGE_OPTIONS[0]
  );
}

function findAudioQualityById(audioQualityId: string) {
  return (
    MOCK_AUDIO_QUALITY_OPTIONS.find(
      (audioQuality) => audioQuality.id === audioQualityId,
    ) ??
    MOCK_AUDIO_QUALITY_OPTIONS.find(
      (audioQuality) =>
        audioQuality.id === DEFAULT_SETTINGS_PREFERENCES.audioQualityId,
    ) ??
    MOCK_AUDIO_QUALITY_OPTIONS[0]
  );
}

export function useSettingsPreferences() {
  const colorScheme = useColorScheme();
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState<boolean>(
    DEFAULT_SETTINGS_PREFERENCES.autoplayEnabled,
  );
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const [isAudioQualityPickerVisible, setIsAudioQualityPickerVisible] =
    useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    DEFAULT_SETTINGS_PREFERENCES.languageId,
  );
  const [selectedAudioQualityId, setSelectedAudioQualityId] = useState<string>(
    DEFAULT_SETTINGS_PREFERENCES.audioQualityId,
  );

  function openLanguagePicker() {
    setIsLanguagePickerVisible(true);
  }

  function closeLanguagePicker() {
    setIsLanguagePickerVisible(false);
  }

  function selectLanguage(language: LanguageOption) {
    setSelectedLanguageId(language.id);
    closeLanguagePicker();
  }

  function openAudioQualityPicker() {
    setIsAudioQualityPickerVisible(true);
  }

  function closeAudioQualityPicker() {
    setIsAudioQualityPickerVisible(false);
  }

  function selectAudioQuality(audioQuality: AudioQualityOption) {
    setSelectedAudioQualityId(audioQuality.id);
    closeAudioQualityPicker();
  }

  function setDarkModeEnabled(enabled: boolean) {
    // Appearance là nguồn theme toàn ứng dụng; hook chỉ chuyển đổi boolean của Switch.
    Appearance.setColorScheme(enabled ? "dark" : "light");
  }

  return {
    appearance: {
      isDarkModeEnabled: colorScheme === "dark",
      setDarkModeEnabled,
    },
    autoplay: {
      isEnabled: isAutoplayEnabled,
      setEnabled: setIsAutoplayEnabled,
    },
    language: {
      closePicker: closeLanguagePicker,
      isPickerVisible: isLanguagePickerVisible,
      openPicker: openLanguagePicker,
      select: selectLanguage,
      selected: findLanguageById(selectedLanguageId),
      selectedId: selectedLanguageId,
    },
    audioQuality: {
      closePicker: closeAudioQualityPicker,
      isPickerVisible: isAudioQualityPickerVisible,
      openPicker: openAudioQualityPicker,
      select: selectAudioQuality,
      selected: findAudioQualityById(selectedAudioQualityId),
      selectedId: selectedAudioQualityId,
    },
  };
}
