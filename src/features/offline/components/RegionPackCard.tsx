import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { OfflineRegionPack } from "../types/offline.types";

interface Props {
  pack: OfflineRegionPack;
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
          {/* Tiêu đề gói: Dùng body (16px) in đậm vừa vặn thay vì heading (22px) */}
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
          {pack.status === "saved" && (
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
          )}

          {pack.status === "downloading" && (
            <ThemedText
              style={[
                theme.typography.caption,
                styles.downloadingText,
                { color: theme.colors.primaryDark },
              ]}
            >
              {pack.progress ?? 0}%
            </ThemedText>
          )}

          {pack.status === "idle" && (
            <View
              style={[
                styles.downloadIconCircle,
                {
                  backgroundColor: theme.colors.white,
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
          )}
        </View>
      </View>

      {pack.status === "downloading" && (
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.cardHover }]}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.colors.primary,
                width: `${Math.min(100, Math.max(0, pack.progress ?? 0))}%`,
              },
            ]}
          />
        </View>
      )}
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
