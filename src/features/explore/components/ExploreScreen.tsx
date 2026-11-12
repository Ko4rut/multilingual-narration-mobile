/** Danh sách Explore dùng POI public API; tìm kiếm chỉ lọc dữ liệu đã tải. */
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

import { EXPLORE_IMAGES } from "../constants/explore-assets";
import { usePois } from "../hooks/usePois";
import type { ExplorePointOfInterest } from "../types/explore.types";
import { PoiCard } from "./PoiCard";

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { pois, loading, error, retry } = usePois();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPois = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return pois;
    return pois.filter((poi) =>
      poi.name.toLocaleLowerCase().includes(query) ||
      poi.description.toLocaleLowerCase().includes(query),
    );
  }, [pois, searchQuery]);

  function handlePoiPress(poi: ExplorePointOfInterest) {
    router.push({
      pathname: "/poi/[id]",
      params: { id: poi.id },
    });
  }

  return (
    <ThemedView style={styles.container}>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
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
            style={[theme.typography.heading, { marginBottom: theme.spacing.xs }]}
          >
            Points of Interest
          </ThemedText>
          <ThemedText color="textSecondary" style={theme.typography.subtitle}>
            Discover published destinations
          </ThemedText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={styles.listScroll}
      >
        {loading ? (
          <View style={styles.feedback}>
            <ActivityIndicator color={theme.colors.primaryDark} />
            <ThemedText color="textSecondary">Đang tải địa điểm...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.feedback}>
            <ThemedText color="textPrimary">Không thể tải danh sách POI.</ThemedText>
            <ThemedText color="textSecondary">{error}</ThemedText>
            <Pressable onPress={retry} accessibilityRole="button" style={styles.retryButton}>
              <ThemedText color="textPrimary">Thử lại</ThemedText>
            </Pressable>
          </View>
        ) : filteredPois.length === 0 ? (
          <View style={styles.feedback}>
            <ThemedText color="textSecondary">
              {searchQuery.trim() ? "Không tìm thấy địa điểm phù hợp." : "Chưa có địa điểm được công bố."}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.listItems}>
            {filteredPois.map((poi) => (
              <PoiCard key={poi.id} poi={poi} onPress={handlePoiPress} />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { height: 240, width: "100%" },
  bannerContent: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  bannerTitle: { marginTop: 50, letterSpacing: 0.5 },
  fixedContent: { paddingHorizontal: 20, paddingTop: 20 },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    marginBottom: 25,
  },
  searchIconImage: { height: 20, width: 20 },
  searchInput: { flex: 1, height: "100%", paddingVertical: 0 },
  sectionHeader: { marginBottom: 15 },
  listScroll: { flex: 1 },
  listContainer: { paddingBottom: 40, paddingHorizontal: 20 },
  listItems: { gap: 15 },
  feedback: { paddingTop: 28, alignItems: "center", gap: 12 },
  retryButton: { paddingHorizontal: 20, paddingVertical: 12 },
});
