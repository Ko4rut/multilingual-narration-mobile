import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { DeviceStorageInfo } from "../types/offline.types";

interface Props {
  storage: DeviceStorageInfo;
}

export function DeviceStorageCard({ storage }: Props) {
  const theme = useTheme();

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
          {storage.displayText}
        </ThemedText>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: theme.colors.cardHover }]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: theme.colors.primary,
              width: `${Math.min(100, Math.max(0, storage.usedPercentage))}%`,
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
