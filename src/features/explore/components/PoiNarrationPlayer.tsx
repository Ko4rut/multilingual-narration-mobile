/** Trạng thái audio narration; chưa phát audio để không giả lập playback. */
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import type { PoiNarrationPlayerProps } from "../types/explore.types";

export function PoiNarrationPlayer({ poiName, narration }: PoiNarrationPlayerProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <ThemedText color="textPrimary" style={theme.typography.sectionTitle}>
            {poiName} — {narration ? narration.language_code.toUpperCase() : "Narration"}
          </ThemedText>
          <ThemedText color="textMuted" style={theme.typography.caption}>
            {narration
              ? "Nội dung đã tải. Tính năng phát audio sẽ được tích hợp sau."
              : "Chưa có audio khả dụng."}
          </ThemedText>
        </View>
        <Pressable
          accessibilityLabel="Audio playback is not yet available"
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
        >
          <View style={[styles.playIcon, { borderLeftColor: theme.colors.white }]} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, marginBottom: 18, padding: 16 },
  header: { alignItems: "center", flexDirection: "row" },
  info: { flex: 1, paddingRight: 15, gap: 6 },
  playButton: {
    alignItems: "center",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50,
    opacity: 0.5,
  },
  playIcon: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderTopWidth: 10,
    height: 0,
    marginLeft: 4,
  },
});
