/**
 * Báo cáo dữ liệu bản đồ đã cài trên thiết bị.
 * Thông tin đọc từ các file thật, không hiển thị trạng thái giả.
 */
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { REQUIRED_OFFLINE_MAP } from "../constants/requiredMap";
import { getBundledGlyphsStatus, type BundledGlyphsStatus } from "../services/bundledGlyphs";
import { getBundledMapStatus, type BundledMapStatus } from "../services/bundledMap";
import { useDeviceStorage } from "../hooks/useDeviceStorage";
import { DeviceStorageCard } from "./DeviceStorageCard";

interface InstalledMapState {
  map: BundledMapStatus;
  glyphs: BundledGlyphsStatus;
}

function formatFileSize(bytes: number): string {
  const mebibytes = bytes / (1024 * 1024);
  return mebibytes.toFixed(2) + " MiB";
}

export default function OfflineScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const deviceStorage = useDeviceStorage();
  const [installedState, setInstalledState] = useState<InstalledMapState | null>(null);

  useEffect(function inspectOfflineFiles() {
    const map = getBundledMapStatus();
    const glyphs = getBundledGlyphsStatus();
    setInstalledState({ map, glyphs });
  }, []);

  let availabilityText = "Đang kiểm tra...";
  let mapSizeText = "";
  let fontStatusText = "";
  let versionText = "";

  if (installedState !== null) {
    if (installedState.map.available && installedState.glyphs.complete) {
      availabilityText = "Sẵn sàng sử dụng offline";
    } else {
      availabilityText = "Thiếu hoặc hỏng dữ liệu offline";
    }

    mapSizeText = formatFileSize(installedState.map.installedBytes);
    fontStatusText =
      installedState.glyphs.installedCount +
      "/" +
      installedState.glyphs.totalCount +
      " file glyph sẵn sàng";
    versionText = installedState.map.version;
  }

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
        <ThemedText style={theme.typography.title}>Bản đồ ngoại tuyến</ThemedText>
        <ThemedText color="textSecondary" style={styles.description}>
          Bản đồ và font đã được đóng gói trong bản cài đặt Android.
          Việc chuẩn bị file cục bộ không cần tải tile từ Internet.
        </ThemedText>
        <DeviceStorageCard
          storage={deviceStorage.storage}
          isLoading={deviceStorage.isLoading}
        />
        <View
          style={[
            styles.mapCard,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
            },
          ]}
        >
          <ThemedText style={theme.typography.heading}>{REQUIRED_OFFLINE_MAP.name}</ThemedText>
          <ThemedText color="textSecondary">Trạng thái: {availabilityText}</ThemedText>
          <ThemedText color="textSecondary">
            Phạm vi zoom: {REQUIRED_OFFLINE_MAP.minZoom}–{REQUIRED_OFFLINE_MAP.maxZoom}
          </ThemedText>
          {installedState !== null && (
            <>
              <ThemedText color="textSecondary">Dung lượng PMTiles: {mapSizeText}</ThemedText>
              <ThemedText color="textSecondary">Font: {fontStatusText}</ThemedText>
              <ThemedText color="textSecondary">Phiên bản dữ liệu: {versionText}</ThemedText>
            </>
          )}
          <ThemedText color="textSecondary">© OpenStreetMap contributors · Protomaps.</ThemedText>
        </View>
        <ThemedText color="textSecondary" style={styles.footer}>
          Bản đồ nền và tên đường có thể sử dụng offline.
          Nội dung POI, ảnh và audio thuyết minh chưa được tích hợp offline đầy đủ.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  description: { marginTop: 12, marginBottom: 12 },
  mapCard: { marginTop: 20, gap: 10 },
  footer: { marginTop: 20 },
});
