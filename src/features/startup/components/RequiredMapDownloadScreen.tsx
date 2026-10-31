/** Explicit, non-skippable first-run download screen with progress and retry. */
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { REQUIRED_OFFLINE_MAP } from "@/features/offline/constants/requiredMap";
import type { RequiredMapState } from "@/features/offline/hooks/useRequiredOfflineMap";

type Props = RequiredMapState & { onRetry: () => void };

export default function RequiredMapDownloadScreen({ phase, progress, error, onRetry }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hasError = phase === "error";
  const percentage = Math.round(progress);

  return (
    <ThemedView
      style={[
        styles.screen,
        {
          paddingTop: insets.top + theme.spacing.xl,
          paddingBottom: insets.bottom + theme.spacing.xl,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.lg }]}>
        <ThemedText style={[theme.typography.title, styles.title]}>
          Chuẩn bị bản đồ ngoại tuyến
        </ThemedText>
        <ThemedText color="textSecondary" style={[theme.typography.body, styles.description]}>
          Ứng dụng cần bản đồ {REQUIRED_OFFLINE_MAP.name} trước khi bắt đầu. Sau lần tải đầu, bạn có thể xem bản đồ trong khu vực này khi không có mạng.
        </ThemedText>
        <ThemedText style={[theme.typography.body, styles.label]}>
          {phase === "checking"
            ? "Đang kiểm tra dữ liệu đã lưu..."
            : hasError
              ? "Tải bản đồ chưa hoàn tất"
              : "Đang tải bản đồ về thiết bị..."}
        </ThemedText>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: percentage }}
          style={[styles.progressTrack, { backgroundColor: theme.colors.cardHover }]}
        >
          <View
            style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: theme.colors.primary }]}
          />
        </View>
        <ThemedText color="textSecondary" style={styles.percentage}>
          {percentage}%
        </ThemedText>
        {hasError && (
          <>
            <ThemedText accessibilityRole="alert" color="textSecondary" style={styles.error}>
              {error ?? "Vui lòng kiểm tra Internet và thử lại."}
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={onRetry}
              style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md }]}
            >
              <ThemedText style={[theme.typography.bodyStrong, { color: theme.colors.surface }]}>
                Thử lại
              </ThemedText>
            </Pressable>
          </>
        )}
        <ThemedText color="textSecondary" style={styles.hint}>
          Giữ ứng dụng mở và ưu tiên kết nối Wi-Fi trong lần tải đầu tiên.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center" },
  card: { width: "100%", gap: 12 },
  title: { textAlign: "center" },
  description: { textAlign: "center", lineHeight: 23 },
  label: { marginTop: 12 },
  progressTrack: { height: 9, borderRadius: 9, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 9 },
  percentage: { textAlign: "right" },
  error: { textAlign: "center" },
  button: { padding: 14, alignItems: "center" },
  hint: { textAlign: "center", marginTop: 8 },
});
