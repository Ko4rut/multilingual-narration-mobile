/** Màn hình khám phá: hiển thị danh sách POI và điều hướng tới trang chi tiết. */
import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

import { EXPLORE_IMAGES } from "../constants/explore-assets";
import { MOCK_POIS } from "../data/mock-pois";
import type { ExplorePointOfInterest } from "../types/explore.types";
import { PoiCard } from "./PoiCard";

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useTheme();

  function handlePoiPress(poi: ExplorePointOfInterest) {
    router.push({
      pathname: "/poi/[id]",
      params: { id: poi.id },
    });
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header đứng yên; chỉ danh sách POI bên dưới được phép cuộn. */}
      <ImageBackground
        resizeMode="cover"
        source={EXPLORE_IMAGES.banner}
        style={styles.headerContainer}
      >
        <View style={styles.bannerContent}>
          <ThemedText
            color="textPrimary"
            style={[theme.typography.heroTitle, styles.bannerTitle]}
          >
            Multilingual{"\n"}
            Automatic{"\n"}
            Narration System
          </ThemedText>
        </View>
      </ImageBackground>

      <View style={styles.fixedContent}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.md,
              gap: theme.spacing.sm,
              paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
            },
          ]}
        >
          <Image
            source={EXPLORE_IMAGES.search}
            style={[
              styles.searchIconImage,
              { tintColor: theme.colors.textSecondary },
            ]}
          />
          <TextInput
            accessibilityLabel="Search points of interest"
            placeholder="Search point of interest..."
            placeholderTextColor={theme.colors.textSecondary}
            returnKeyType="search"
            style={[
              theme.typography.supporting,
              styles.searchInput,
              { color: theme.colors.textPrimary },
            ]}
          />
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            color="textPrimary"
            style={[
              theme.typography.heading,
              { marginBottom: theme.spacing.xs },
            ]}
          >
            Points of Interest near you
          </ThemedText>
          <ThemedText color="textSecondary" style={theme.typography.subtitle}>
            Narrations trigger automatically as you walk
          </ThemedText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={styles.listScroll}
      >
        <View style={styles.listItems}>
          {MOCK_POIS.map((poi) => (
            <PoiCard key={poi.id} poi={poi} onPress={handlePoiPress} />
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
  headerContainer: {
    height: 240,
    width: "100%",
  },
  bannerContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  bannerTitle: {
    marginTop: 50,
    letterSpacing: 0.5,
  },
  fixedContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    marginBottom: 25,
  },
  searchIconImage: {
    height: 20,
    width: 20,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  listScroll: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  listItems: {
    gap: 15,
  },
});
