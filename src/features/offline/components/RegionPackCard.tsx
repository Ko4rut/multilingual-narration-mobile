/** Thẻ gói khu vực với trạng thái tải, đã lưu hoặc sẵn sàng tải. */
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { OfflineRegionPack } from "../types/offline.types";

interface Props {
  pack: OfflineRegionPack;
}

function getDownloadPercentage(progress?: number): number {
  if (typeof progress !== "number") {
    return 0;
  }
  if (progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}

function renderAction(pack: OfflineRegionPack, theme: ReturnType<typeof useTheme>) {
  if (pack.status === "saved") {
    return (
      <View
        style={[
          styles.savedBadge,
          {
            backgroundColor: theme.colors.primaryLight,
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing.sm + 2,
            paddingVertical: theme.spacing.xs - 1,
          },
        ]}
      >
        <ThemedText
          style={[
            theme.typography.caption,
            styles.savedBadgeText,
            { color: theme.colors.primaryDark },
          ]}
        >
          Saved
        </ThemedText>
      </View>
    );
  }

  if (pack.status === "downloading") {
    const progress = getDownloadPercentage(pack.progress);
    return (
      <ThemedText
        style={[
          theme.typography.caption,
          styles.downloadingText,
          { color: theme.colors.primaryDark },
        ]}
      >
        {progress}%
      </ThemedText>
    );
  }

  return (
    <View
      style={[
        styles.downloadIconCircle,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <SymbolView
        name={{
          ios: "arrow.down.to.line",
          android: "arrow_downward",
          web: "arrow_downward",
        }}
        size={16}
        tintColor={theme.colors.textPrimary}
      />
    </View>
  );
}

function renderProgressBar(pack: OfflineRegionPack, theme: ReturnType<typeof useTheme>) {
  if (pack.status !== "downloading") {
    return null;
  }

  const progress = getDownloadPercentage(pack.progress);

  return (
    <View style={[styles.progressTrack, { backgroundColor: theme.colors.cardHover }]}>
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: theme.colors.primary,
            width: `${progress}%`,
          },
        ]}
      />
    </View>
  );
}

export function RegionPackCard({ pack }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
        },
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.infoColumn}>
          <ThemedText
            style={[
              theme.typography.body,
              styles.title,
              { color: theme.colors.textPrimary },
            ]}
          >
            {pack.name}
          </ThemedText>

          <ThemedText
            color="textSecondary"
            style={[
              theme.typography.caption,
              { marginTop: theme.spacing.xs - 1 },
            ]}
          >
            Size: {pack.formattedSize} • Languages: {pack.languages.join(", ")}
          </ThemedText>
        </View>

        <View style={styles.actionColumn}>
          {renderAction(pack, theme)}
        </View>
      </View>

      {renderProgressBar(pack, theme)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoColumn: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  actionColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  savedBadge: {},
  savedBadgeText: {
    fontWeight: "700",
  },
  downloadingText: {
    fontWeight: "700",
  },
  downloadIconCircle: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
