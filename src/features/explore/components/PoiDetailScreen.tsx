/** Màn hình chi tiết POI, nhận điều hướng từ route và render dữ liệu feature. */
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { formatDistance } from "@/utils/format-distance";

import { EXPLORE_IMAGES } from "../constants/explore-assets";
import { MOCK_POIS } from "../data/mock-pois";
import { PoiDetailHero } from "./PoiDetailHero";
import { PoiNarrationPlayer } from "./PoiNarrationPlayer";

type PoiDetailScreenProps = {
  poiId: string;
  onBack(): void;
};

export default function PoiDetailScreen({
  poiId,
  onBack,
}: PoiDetailScreenProps) {
  const theme = useTheme();
  const poi = MOCK_POIS.find((candidate) => candidate.id === poiId);

  if (!poi) {
    return (
      <ThemedView style={[styles.container, styles.notFound]}>
        <ThemedText color="textPrimary" style={theme.typography.heading}>
          Không tìm thấy địa điểm!
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.notFoundBackButton}
        >
          <Text
            style={[
              theme.typography.bodyStrong,
              { color: theme.colors.primaryDark },
            ]}
          >
            Quay lại
          </Text>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PoiDetailHero
          imageUrl={poi.imageUrl}
          onBack={onBack}
          poiName={poi.name}
        />

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <ThemedText
                color="textPrimary"
                style={[theme.typography.heading, styles.title]}
              >
                {poi.name}
              </ThemedText>
              <ThemedText
                color="textSecondary"
                numberOfLines={1}
                style={theme.typography.supporting}
              >
                {poi.categories.join(" • ")}
              </ThemedText>
            </View>

            <View
              style={[
                styles.distanceBadge,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Image
                source={EXPLORE_IMAGES.mapPin}
                style={[
                  styles.locationIcon,
                  { tintColor: theme.colors.primaryDark },
                ]}
              />
              <Text
                style={[
                  theme.typography.label,
                  { color: theme.colors.primaryDark },
                ]}
              >
                {formatDistance(poi.distanceMeters)}
              </Text>
            </View>
          </View>

          <PoiNarrationPlayer poiName={poi.name} />

          <View style={styles.scriptSection}>
            <ThemedText
              color="textPrimary"
              style={[theme.typography.sectionTitle, styles.scriptTitle]}
            >
              Historic Narration Script
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={[theme.typography.body, styles.scriptParagraph]}
            >
              {poi.description}
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={[theme.typography.body, styles.scriptParagraph]}
            >
              Welcome to {poi.name}. As you explore this{" "}
              {poi.categories[0]?.toLowerCase() || "landmark"}, you will
              discover its unique history and significance to the city.
              Narration is automatically triggered when you enter the virtual
              geofence.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundBackButton: {
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    marginBottom: 6,
  },
  distanceBadge: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationIcon: {
    height: 14,
    marginRight: 4,
    width: 14,
  },
  scriptSection: {
    marginTop: 10,
  },
  scriptTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  scriptParagraph: {
    marginBottom: 15,
  },
});
