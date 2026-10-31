/** Offline tab reports the actual native map pack instead of fixture packages. */
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { REQUIRED_OFFLINE_MAP } from "../constants/requiredMap";
import { getRequiredOfflinePack, isPackComplete } from "../services/requiredOfflineMap";
import { useDeviceStorage } from "../hooks/useDeviceStorage";
import { DeviceStorageCard } from "./DeviceStorageCard";

type InstalledMap = { available: boolean; bytes: number; error: string | null };

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OfflineScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { storage, isLoading } = useDeviceStorage();
  const [installed, setInstalled] = useState<InstalledMap | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const pack = await getRequiredOfflinePack();
        const status = pack ? await pack.status() : null;
        if (mounted) {
          setInstalled({
            available: status ? isPackComplete(status) : false,
            bytes: status?.completedResourceSize ?? 0,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setInstalled({ available: false, bytes: 0, error: String(error) });
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.xl,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        <ThemedText style={[theme.typography.title, styles.heading]}>Bản đồ ngoại tuyến</ThemedText>
        <ThemedText color="textSecondary" style={{ marginBottom: theme.spacing.lg }}>
          Bản đồ đã tải được lưu trên thiết bị và có thể sử dụng khi không có Internet.
        </ThemedText>
        <DeviceStorageCard storage={storage} isLoading={isLoading} />
        <View style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginTop: theme.spacing.lg }}>
          <ThemedText style={theme.typography.heading}>{REQUIRED_OFFLINE_MAP.name}</ThemedText>
          <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
            Zoom {REQUIRED_OFFLINE_MAP.minZoom}–{REQUIRED_OFFLINE_MAP.maxZoom} · {installed === null ? "Đang kiểm tra..." : installed.available ? "Đã tải về" : "Chưa hoàn tất"}
          </ThemedText>
          {installed?.available && (
            <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.xs }}>
              Dữ liệu tài nguyên đã lưu: {formatSize(installed.bytes)}
            </ThemedText>
          )}
          {installed?.error && <ThemedText color="textSecondary">{installed.error}</ThemedText>}
        </View>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.lg }}>
          Nội dung POI và audio ngoại tuyến sẽ được bổ sung ở giai đoạn tiếp theo.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { marginBottom: 10 },
});
