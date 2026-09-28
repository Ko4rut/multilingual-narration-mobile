import { useState } from "react";
import {
  Alert,
  Appearance,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";

import {
  DEFAULT_AUDIO_QUALITY,
  DEFAULT_LANGUAGE,
  MOCK_AUDIO_QUALITY_OPTIONS,
  MOCK_LANGUAGE_OPTIONS,
  type AudioQualityOption,
  type LanguageOption,
} from "../data/mock-settings-options";
import { SettingsOptionPickerModal } from "./SettingsOptionPickerModal";
import { SettingsRow } from "./SettingsRow";
import { SettingsSection } from "./SettingsSection";

function findLanguageById(languageId: string) {
  for (const language of MOCK_LANGUAGE_OPTIONS) {
    if (language.id === languageId) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
}

function findAudioQualityById(audioQualityId: string) {
  for (const audioQuality of MOCK_AUDIO_QUALITY_OPTIONS) {
    if (audioQuality.id === audioQualityId) {
      return audioQuality;
    }
  }

  return DEFAULT_AUDIO_QUALITY;
}

// Cung cấp tên bản địa làm nội dung phụ cho lựa chọn ngôn ngữ.
function getLanguageSupportingText(language: LanguageOption) {
  if (language.nativeLabel === language.label) {
    return undefined;
  }

  return language.nativeLabel;
}

// Cung cấp mô tả mức sử dụng dữ liệu cho lựa chọn chất lượng âm thanh.
function getAudioQualitySupportingText(audioQuality: AudioQualityOption) {
  return audioQuality.description;
}

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkModeEnabled = colorScheme === "dark";

  // Lưu trạng thái bật hoặc tắt tính năng tự động phát thuyết minh.
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] = useState(false);
  const [isAudioQualityPickerVisible, setIsAudioQualityPickerVisible] =
    useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState(
    DEFAULT_LANGUAGE.id,
  );
  const [selectedAudioQualityId, setSelectedAudioQualityId] = useState(
    DEFAULT_AUDIO_QUALITY.id,
  );
  const selectedLanguage = findLanguageById(selectedLanguageId);
  const selectedAudioQuality = findAudioQualityById(selectedAudioQualityId);

  // Mở phần lựa chọn ngôn ngữ mặc định.
  function handleLanguagePress() {
    setIsLanguagePickerVisible(true);
  }

  function handleLanguagePickerClose() {
    setIsLanguagePickerVisible(false);
  }

  function handleLanguageSelect(language: LanguageOption) {
    setSelectedLanguageId(language.id);
    setIsLanguagePickerVisible(false);
  }

  // Mở phần lựa chọn chất lượng âm thanh.
  function handleAudioQualityPress() {
    setIsAudioQualityPickerVisible(true);
  }

  function handleAudioQualityPickerClose() {
    setIsAudioQualityPickerVisible(false);
  }

  function handleAudioQualitySelect(audioQuality: AudioQualityOption) {
    setSelectedAudioQualityId(audioQuality.id);
    setIsAudioQualityPickerVisible(false);
  }

  // Cập nhật trạng thái autoplay khi người dùng thay đổi Switch.
  function handleAutoplayChange(value: boolean) {
    setIsAutoplayEnabled(value);
  }

  // Ghi đè giao diện của toàn ứng dụng theo lựa chọn Light hoặc Dark.
  function handleDarkModeChange(value: boolean) {
    Appearance.setColorScheme(value ? "dark" : "light");
  }

  // Mở thông tin về các đối tác cung cấp giọng thuyết minh.
  function handleVoicePartnersPress() {
    Alert.alert(
      "Narration Voice Partners",
      "Voice partner information will be available here.",
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* ScrollView giúp giao diện vẫn sử dụng được trên màn hình có chiều cao nhỏ. */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            // Kết hợp safe area để nội dung không bị che bởi status bar và cạnh dưới.
            paddingHorizontal: theme.spacing.md + theme.spacing.xs,
            paddingTop: insets.top + theme.spacing.lg,
            paddingBottom: insets.bottom + theme.spacing.lg + theme.spacing.xs,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { marginBottom: theme.spacing.md }]}>
          <Text
            style={[
              theme.typography.heading,
              { color: theme.colors.textPrimary },
            ]}
          >
            App Settings
          </Text>

          <Text
            style={[
              theme.typography.supporting,
              { marginTop: theme.spacing.xs },
              { color: theme.colors.textSecondary },
            ]}
          >
            Configure your sound narration triggers
          </Text>
        </View>

        {/* Nhóm các tùy chọn mà người dùng có thể thay đổi. */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon={{ ios: "globe", android: "language", web: "language" }}
            label="Default Language"
            onPress={handleLanguagePress}
            showChevron
            value={selectedLanguage.label}
          />

          <SettingsRow
            icon={{
              ios: "speaker.wave.2.fill",
              android: "volume_up",
              web: "volume_up",
            }}
            label="Audio Quality"
            onPress={handleAudioQualityPress}
            showChevron
            value={selectedAudioQuality.label}
          />

          {/* Truyền Switch qua control để SettingsRow có thể tái sử dụng với nhiều loại input. */}
          <SettingsRow
            control={
              <Switch
                accessibilityLabel="Narration Autoplay"
                ios_backgroundColor={theme.colors.border}
                onValueChange={handleAutoplayChange}
                thumbColor={theme.colors.white}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                value={isAutoplayEnabled}
              />
            }
            icon={{
              ios: "bell.and.waves.left.and.right.fill",
              android: "notifications_active",
              web: "notifications_active",
            }}
            label="Narration Autoplay"
          />
        </SettingsSection>

        {/* Theme được áp dụng cho toàn ứng dụng thông qua Appearance API. */}
        <SettingsSection title="Appearance">
          <SettingsRow
            control={
              <Switch
                accessibilityLabel="Dark Mode"
                ios_backgroundColor={theme.colors.border}
                onValueChange={handleDarkModeChange}
                thumbColor={theme.colors.white}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                value={isDarkModeEnabled}
              />
            }
            icon={{
              ios: "moon.fill",
              android: "dark_mode",
              web: "dark_mode",
            }}
            label="Dark Mode"
          />
        </SettingsSection>

        {/* Nhóm thông tin hệ thống và dữ liệu chỉ đọc. */}
        <SettingsSection title="System Info">
          <SettingsRow label="Version" value="v2.4.1 (Stable)" />

          <SettingsRow
            label="Narration Voice Partners"
            onPress={handleVoicePartnersPress}
            showChevron
          />
        </SettingsSection>
      </ScrollView>

      <SettingsOptionPickerModal
        accessibilityLabel="language picker"
        description="Select the language used for narration and transcripts."
        getSupportingText={getLanguageSupportingText}
        onClose={handleLanguagePickerClose}
        onSelect={handleLanguageSelect}
        options={MOCK_LANGUAGE_OPTIONS}
        selectedOptionId={selectedLanguageId}
        title="Choose Language"
        visible={isLanguagePickerVisible}
      />

      <SettingsOptionPickerModal
        accessibilityLabel="audio quality picker"
        description="Select the streaming quality used for narration audio."
        getSupportingText={getAudioQualitySupportingText}
        onClose={handleAudioQualityPickerClose}
        onSelect={handleAudioQualitySelect}
        options={MOCK_AUDIO_QUALITY_OPTIONS}
        selectedOptionId={selectedAudioQualityId}
        title="Choose Audio Quality"
        visible={isAudioQualityPickerVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {},
});
