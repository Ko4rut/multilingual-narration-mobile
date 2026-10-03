/** Hiển thị dung lượng thiết bị và thanh tỷ lệ bộ nhớ đã sử dụng. */
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { DeviceStorageInfo } from "../types/offline.types";

interface Props {
  storage: DeviceStorageInfo | null;
  isLoading?: boolean;
}

function getDisplayText(storage: DeviceStorageInfo | null, isLoading?: boolean): string {
  if (isLoading) {
    return "Checking storage...";
  }
  if (!storage) {
    return "Storage info unavailable";
  }
  return storage.displayText;
}

function getProgressWidth(storage: DeviceStorageInfo | null): number {
  if (!storage) {
    return 0;
  }
  if (storage.usedPercentage < 0) {
    return 0;
  }
  if (storage.usedPercentage > 100) {
    return 100;
  }
  return storage.usedPercentage;
}

export function DeviceStorageCard({ storage, isLoading }: Props) {
  const theme = useTheme();
  const displayText = getDisplayText(storage, isLoading);
  const progressWidth = getProgressWidth(storage);

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
              width: `${progressWidth}%`,
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
