/** Màn hình ghép hook preferences với các nhóm UI cài đặt ứng dụng. */
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";

import {
    APP_VERSION_LABEL,
    SETTINGS_PICKER_COPY,
    VOICE_PARTNERS_ALERT,
} from "../constants/preferences";
import {
    MOCK_AUDIO_QUALITY_OPTIONS,
    MOCK_LANGUAGE_OPTIONS,
} from "../data/mock-settings-options";
import { useSettingsPreferences } from "../hooks/useSettingsPreferences";
import type {
    AudioQualityOption,
    LanguageOption,
} from "../types/settings.types";
import { SettingsOptionPickerModal } from "./SettingsOptionPickerModal";
import { SettingsRow } from "./SettingsRow";
import { SettingsSection } from "./SettingsSection";

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
  const { appearance, audioQuality, autoplay, language } =
    useSettingsPreferences();

  // Mở thông tin về các đối tác cung cấp giọng thuyết minh.
  function handleVoicePartnersPress() {
    Alert.alert(VOICE_PARTNERS_ALERT.title, VOICE_PARTNERS_ALERT.message);
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
            onPress={language.openPicker}
            showChevron
            value={language.selected.label}
          />

          <SettingsRow
            icon={{
              ios: "speaker.wave.2.fill",
              android: "volume_up",
              web: "volume_up",
            }}
            label="Audio Quality"
            onPress={audioQuality.openPicker}
            showChevron
            value={audioQuality.selected.label}
          />

          {/* Truyền Switch qua control để SettingsRow có thể tái sử dụng với nhiều loại input. */}
          <SettingsRow
            control={
              <Switch
                accessibilityLabel="Narration Autoplay"
                ios_backgroundColor={theme.colors.border}
                onValueChange={autoplay.setEnabled}
                thumbColor={theme.colors.white}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                value={autoplay.isEnabled}
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
                onValueChange={appearance.setDarkModeEnabled}
                thumbColor={theme.colors.white}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                value={appearance.isDarkModeEnabled}
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
          <SettingsRow label="Version" value={APP_VERSION_LABEL} />

          <SettingsRow
            label="Narration Voice Partners"
            onPress={handleVoicePartnersPress}
            showChevron
          />
        </SettingsSection>
      </ScrollView>

      <SettingsOptionPickerModal
        accessibilityLabel={SETTINGS_PICKER_COPY.language.accessibilityLabel}
        description={SETTINGS_PICKER_COPY.language.description}
        getSupportingText={getLanguageSupportingText}
        onClose={language.closePicker}
        onSelect={language.select}
        options={MOCK_LANGUAGE_OPTIONS}
        selectedOptionId={language.selectedId}
        title={SETTINGS_PICKER_COPY.language.title}
        visible={language.isPickerVisible}
      />

      <SettingsOptionPickerModal
        accessibilityLabel={
          SETTINGS_PICKER_COPY.audioQuality.accessibilityLabel
        }
        description={SETTINGS_PICKER_COPY.audioQuality.description}
        getSupportingText={getAudioQualitySupportingText}
        onClose={audioQuality.closePicker}
        onSelect={audioQuality.select}
        options={MOCK_AUDIO_QUALITY_OPTIONS}
        selectedOptionId={audioQuality.selectedId}
        title={SETTINGS_PICKER_COPY.audioQuality.title}
        visible={audioQuality.isPickerVisible}
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
