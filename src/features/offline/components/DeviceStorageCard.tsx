import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { DeviceStorageInfo } from "../types/offline.types";

interface Props {
  storage: DeviceStorageInfo | null;
  isLoading?: boolean;
}

export function DeviceStorageCard({ storage, isLoading }: Props) {
  const theme = useTheme();

  const displayText = isLoading
    ? "Checking storage..."
    : (storage?.displayText ?? "Storage info unavailable");

  const percentage = storage ? Math.min(100, Math.max(0, storage.usedPercentage)) : 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <ThemedText
          style={[
            theme.typography.subtitle,
            styles.label,
            { color: theme.colors.textPrimary },
          ]}
        >
          Device Storage
        </ThemedText>
        <ThemedText
          color="textSecondary"
          style={theme.typography.caption}
        >
          {displayText}
        </ThemedText>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: theme.colors.cardHover }]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: theme.colors.primary,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: "700",
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});
