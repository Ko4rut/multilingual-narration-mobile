/** Thẻ POI của Explore, gồm ảnh, category chạy ngang và khoảng cách. */
import { Image } from "expo-image";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type PressableStateCallbackType,
} from "react-native";

import { useCategoryMarquee } from "@/hooks/use-category-marquee";
import { useTheme } from "@/hooks/use-theme";
import { formatDistance } from "@/utils/format-distance";

import { EXPLORE_IMAGES } from "../constants/explore-assets";
import type { ExplorePointOfInterest } from "../types/explore.types";

type PoiCardProps = {
  poi: ExplorePointOfInterest;
  onPress?(poi: ExplorePointOfInterest): void;
};

// COMPONENT TẠO THẺ DANH MỤC CÓ NỀN TRẮNG
function CategoryBadge({ category }: { category: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.categoryBadge,
        {
          backgroundColor: theme.colors.background,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 4,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          theme.typography.caption,
          { color: theme.colors.textSecondary, fontWeight: "600" },
        ]}
      >
        {category}
      </Text>
    </View>
  );
}

// COMPONENT ĐO CHIỀU RỘNG DÃY DANH MỤC
function CategorySequence({
  categories,
  onLayout,
}: {
  categories: string[];
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const theme = useTheme();
  return (
    <View
      onLayout={onLayout}
      style={[styles.categorySequence, { gap: theme.spacing.xs }]}
    >
      {categories.map((category, index) => (
        <CategoryBadge category={category} key={`${category}-${index}`} />
      ))}
    </View>
  );
}

function CategoryMarquee({ categories }: { categories: string[] }) {
  const theme = useTheme();
  const marqueeGap = theme.spacing.xs;
  const {
    handleContentLayout,
    handleViewportLayout,
    isOverflowing,
    translateX,
  } = useCategoryMarquee(marqueeGap);

  return (
    <View onLayout={handleViewportLayout} style={styles.categoriesViewport}>
      <Animated.View
        style={[
          styles.categoriesTrack,
          {
            gap: marqueeGap,
            transform: [{ translateX }],
          },
        ]}
      >
        <CategorySequence
          categories={categories}
          onLayout={handleContentLayout}
        />
        {isOverflowing ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <CategorySequence categories={categories} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

// COMPONENT CHÍNH CỦA POI CARD
export function PoiCard({ poi, onPress }: PoiCardProps) {
  const theme = useTheme();

  function handlePress() {
    onPress?.(poi);
  }

  function getCardStyle({ pressed }: PressableStateCallbackType) {
    return [
      styles.card,
      {
        backgroundColor: pressed ? theme.colors.cardHover : theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.sm + theme.spacing.xs,
      },
    ];
  }

  return (
    <Pressable
      accessibilityHint="Opens details and narration for this point of interest"
      accessibilityLabel={`${poi.name}, ${formatDistance(poi.distanceMeters)} away`}
      accessibilityRole="button"
      onPress={handlePress}
      style={getCardStyle}
    >
      <Image
        accessibilityLabel={`Photo of ${poi.name}`}
        contentFit="cover"
        source={{ uri: poi.imageUrl }}
        style={[
          styles.image,
          {
            backgroundColor: theme.colors.cardHover,
            borderRadius: theme.radius.md,
          },
        ]}
        transition={180}
      />

      <View
        style={[
          styles.details,
          { marginLeft: theme.spacing.sm + theme.spacing.xs },
        ]}
      >
        <View style={[styles.metaRow, { gap: theme.spacing.sm }]}>
          <CategoryMarquee categories={poi.categories} />

          <View style={styles.distance}>
            <Image
              source={EXPLORE_IMAGES.mapPin}
              style={{
                width: 14,
                height: 14,
                tintColor: theme.colors.primaryDark,
                marginRight: 4,
              }}
              contentFit="contain"
            />
            <Text
              style={[
                theme.typography.label,
                { color: theme.colors.primaryDark, fontSize: 13 },
              ]}
            >
              {formatDistance(poi.distanceMeters)}
            </Text>
          </View>
        </View>

        {/* Tên và mô tả POI */}
        <Text
          numberOfLines={1}
          style={[
            theme.typography.sectionTitle,
            { marginTop: 6, color: theme.colors.textPrimary },
          ]}
        >
          {poi.name}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            theme.typography.caption,
            { marginTop: 4, color: theme.colors.textSecondary },
          ]}
        >
          {poi.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 88,
    height: 88,
  },
  details: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoriesViewport: {
    flex: 1,
    overflow: "hidden",
  },
  categoriesTrack: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  categorySequence: {
    flexDirection: "row",
    flexShrink: 0,
  },
  categoryBadge: {
    maxWidth: 128,
    justifyContent: "center",
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
});
