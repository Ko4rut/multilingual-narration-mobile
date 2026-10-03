/** Trình phát narration dạng tĩnh của màn hình chi tiết POI. */
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type PoiNarrationPlayerProps = {
  poiName: string;
};

export function PoiNarrationPlayer({ poiName }: PoiNarrationPlayerProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <ThemedText
            color="textPrimary"
            style={[theme.typography.sectionTitle, styles.title]}
          >
            {poiName} - Narration - EN
          </ThemedText>
          <ThemedText color="textMuted" style={theme.typography.caption}>
            Narrated by System
          </ThemedText>
        </View>

        <Pressable
          accessibilityLabel={`Play narration for ${poiName}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          style={[
            styles.playButton,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.playIcon,
              { borderLeftColor: theme.colors.white },
            ]}
          />
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.border },
          ]}
        >
          <View
            style={[
              styles.progress,
              { backgroundColor: theme.colors.primaryDark },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <ThemedText color="textMuted" style={theme.typography.caption}>
            0:00
          </ThemedText>
          <ThemedText color="textMuted" style={theme.typography.caption}>
            2:15
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 30,
    padding: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  info: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    marginBottom: 4,
  },
  playButton: {
    alignItems: "center",
    borderRadius: 25,
    elevation: 3,
    height: 50,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 50,
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
    width: 0,
  },
  progressContainer: {
    width: "100%",
  },
  progressBar: {
    borderRadius: 2,
    height: 4,
    marginBottom: 8,
  },
  progress: {
    borderRadius: 2,
    height: "100%",
    width: "30%",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
