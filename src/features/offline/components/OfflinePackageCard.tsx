/** Card metadata của package đã publish; không giả lập trạng thái đã tải. */
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import type { OfflinePackageSummary } from "../types/offline-package.types";

interface Props {
  item: OfflinePackageSummary;
  regionName: string;
  languageName: string;
}

function formatSize(size: number | null): string {
  if (size === null) {
    return "Chưa có thông tin dung lượng";
  }

  const sizeInMiB = size / (1024 * 1024);
  return sizeInMiB.toFixed(1) + " MiB";
}

export function OfflinePackageCard({ item, regionName, languageName }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: theme.radius.lg,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <ThemedText style={theme.typography.sectionTitle}>{item.name}</ThemedText>
          <ThemedText color="textSecondary" style={theme.typography.caption}>
            {regionName} · {languageName}
          </ThemedText>
        </View>
        <View style={[styles.version, { backgroundColor: theme.colors.primaryLight }]}>
          <ThemedText style={[theme.typography.caption, { color: theme.colors.primaryDark }]}>
            v{item.version}
          </ThemedText>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      <View style={styles.metadataRow}>
        <ThemedText color="textSecondary" style={theme.typography.caption}>
          {formatSize(item.totalSizeBytes)}
        </ThemedText>
        <ThemedText style={[theme.typography.caption, { color: theme.colors.success }]}>
          ● Đã phát hành
        </ThemedText>
      </View>
      <View
        style={[
          styles.upcoming,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.sm,
            paddingVertical: theme.spacing.sm,
          },
        ]}
      >
        <ThemedText color="textSecondary" style={[theme.typography.caption, styles.upcomingText]}>
          Tải về thiết bị — sẽ có ở giai đoạn tiếp theo
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, gap: 12 },
  headingRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  headingCopy: { flex: 1, gap: 5 },
  version: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  divider: { height: StyleSheet.hairlineWidth },
  metadataRow: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  upcoming: { alignItems: "center" },
  upcomingText: { textAlign: "center" },
});
