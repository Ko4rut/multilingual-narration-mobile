/**
 * Hiển thị POI và narration trả về sau khi QR Resolve thành công.
 * QrAudioPlayer tự load và phát MP3 ngay khi component kết quả xuất hiện.
 * "Quét mã khác" sẽ unmount player hiện tại rồi mở lại camera.
 */
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import type { ResolvedQrAudio } from "../types/qr-scan.types";
import { QrAudioPlayer } from "./QrAudioPlayer";

interface QrNarrationResultProps {
  audio: ResolvedQrAudio;
  onScanAgain: () => void;
}

export function QrNarrationResult({
  audio,
  onScanAgain,
}: QrNarrationResultProps) {
  const theme = useTheme();
  let fallbackNotice = "";

  if (audio.isFallback) {
    fallbackNotice = "Không có audio theo ngôn ngữ yêu cầu. Backend đã chọn bản " +
      audio.languageCode + ".";
  } else {
    fallbackNotice = "Đã tìm thấy audio theo ngôn ngữ yêu cầu.";
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <ThemedText style={[theme.typography.sectionTitle, styles.title]}>
        Đã xác định audio
      </ThemedText>

      <ThemedText style={[theme.typography.title, styles.poiName]}>
        {audio.poiName}
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.detail}>
        Mã QR: {audio.qrCode}
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.detail}>
        Content ID: {audio.contentId}
      </ThemedText>

      <ThemedText style={[theme.typography.bodyStrong, styles.narrationTitle]}>
        {audio.narrationTitle}
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.detail}>
        Ngôn ngữ: {audio.languageCode}
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.detail}>
        Thời lượng: {audio.durationSeconds} giây
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.detail}>
        Nguồn audio: {audio.audioSourceType}
      </ThemedText>

      <ThemedText color="textSecondary" style={styles.fallbackNotice}>
        {fallbackNotice}
      </ThemedText>

      {/* Component riêng dùng expo-audio để tự load và phát MP3 trong app. */}
      <QrAudioPlayer
        key={audio.contentId}
        audioUrl={audio.audioUrl}
        durationSeconds={audio.durationSeconds}
      />

      <Pressable
        accessibilityRole="button"
        onPress={onScanAgain}
        style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
      >
        <ThemedText style={styles.secondaryButtonText}>
          Quét mã QR khác
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  title: {
    marginBottom: 8,
  },
  poiName: {
    marginBottom: 8,
  },
  narrationTitle: {
    marginTop: 12,
  },
  detail: {
    fontSize: 14,
    lineHeight: 21,
  },
  fallbackNotice: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
  },
  secondaryButton: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
