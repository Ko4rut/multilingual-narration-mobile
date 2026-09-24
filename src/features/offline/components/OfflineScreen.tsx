import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import { MOCK_DEVICE_STORAGE, MOCK_OFFLINE_PACKS } from "../data/mock-offline-packs";
import { DeviceStorageCard } from "./DeviceStorageCard";
import { RegionPackCard } from "./RegionPackCard";

export default function OfflineScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top > 0 ? insets.top + theme.spacing.md : theme.spacing.lg,
            paddingBottom: insets.bottom > 0 ? insets.bottom + theme.spacing.lg : theme.spacing.xl,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <View style={[styles.header, { marginTop: theme.spacing.sm }]}>
          <ThemedText
            style={[
              theme.typography.title,
              styles.screenTitle,
              { color: theme.colors.textPrimary },
            ]}
          >
            Offline Content Guides
          </ThemedText>

          <ThemedText
            color="textSecondary"
            style={[
              theme.typography.subtitle,
              { marginTop: theme.spacing.xs + 2 },
            ]}
          >
            Download whole regions over Wi-Fi to use without cellular data
          </ThemedText>
        </View>

        <DeviceStorageCard storage={MOCK_DEVICE_STORAGE} />

        <View style={[styles.listSection, { marginTop: theme.spacing.lg + 4 }]}>
          <ThemedText
            style={[
              theme.typography.heading,
              styles.sectionTitle,
              {
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.md - 2,
              },
            ]}
          >
            Available Region Packs
          </ThemedText>

          {MOCK_OFFLINE_PACKS.map((pack) => (
            <RegionPackCard key={pack.id} pack={pack} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {},
  screenTitle: {
    letterSpacing: -0.4,
  },
  listSection: {},
  sectionTitle: {
    letterSpacing: -0.3,
  },
});
