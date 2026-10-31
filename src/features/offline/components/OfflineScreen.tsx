/** Map tiles are bundled with the native Android application. */
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { REQUIRED_OFFLINE_MAP } from "../constants/requiredMap";
import { useDeviceStorage } from "../hooks/useDeviceStorage";
import { DeviceStorageCard } from "./DeviceStorageCard";

export default function OfflineScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { storage, isLoading } = useDeviceStorage();
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + theme.spacing.lg, paddingBottom: insets.bottom + theme.spacing.xl, paddingHorizontal: theme.spacing.lg }}>
        <ThemedText style={theme.typography.title}>Bản đồ ngoại tuyến</ThemedText>
        <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          Bản đồ TP.HCM được đóng gói sẵn trong bản cài đặt Android, không cần tải qua Internet.
        </ThemedText>
        <DeviceStorageCard storage={storage} isLoading={isLoading} />
        <View style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginTop: theme.spacing.lg }}>
          <ThemedText style={theme.typography.heading}>{REQUIRED_OFFLINE_MAP.name}</ThemedText>
          <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
            Zoom {REQUIRED_OFFLINE_MAP.minZoom}–{REQUIRED_OFFLINE_MAP.maxZoom} · Bản đồ tích hợp sẵn
          </ThemedText>
          <ThemedText color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
            © OpenStreetMap contributors · Protomaps. Không bao gồm POI và audio offline.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 } });
