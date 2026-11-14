/**
 * Hiển thị POI và metadata MP3 trả về sau QR Resolve thành công.
 * Nút mở MP3 chỉ dùng để kiểm thử asset bằng trình duyệt/ứng dụng hệ thống;
 * trình phát audio native sẽ là một tính năng độc lập trong bước tiếp theo.
 */
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import type { ResolvedQrAudio } from "../types/qr-scan.types";

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

  async function handleOpenAudio(): Promise<void> {
    try {
      // Không gọi URL này để tăng listening. Mở MP3 chỉ phục vụ kiểm thử.
      await Linking.openURL(audio.audioUrl);
    } catch (cause) {
      Alert.alert(
        "Không mở được file âm thanh",
        "Hãy kiểm tra kết nối mạng và địa chỉ audio_url từ backend.",
      );
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <ThemedText
        style={[theme.typography.sectionTitle, styles.title]}
      >
        Đã xác định audio
      </ThemedText>

      <ThemedText
        style={[theme.typography.title, styles.poiName]}
      >
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

      <ThemedText color="textMuted" selectable style={styles.audioUrl}>
        {audio.audioUrl}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        onPress={handleOpenAudio}
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
      >
        <ThemedText style={[styles.primaryButtonText, { color: theme.colors.white }]}>
          Mở file MP3 để kiểm thử
        </ThemedText>
      </Pressable>

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
  audioUrl: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
