import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type PressableStateCallbackType,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

import type { PointOfInterest } from "../types";

type PoiCardProps = {
  poi: PointOfInterest;
  onPress?(poi: PointOfInterest): void;
};

type CategoryMarqueeProps = {
  categories: string[];
};

type CategorySequenceProps = CategoryMarqueeProps & {
  onLayout?(event: LayoutChangeEvent): void;
};

const MARQUEE_INITIAL_DELAY = 800;
const MARQUEE_REPEAT_DELAY = 15000;
const MARQUEE_MINIMUM_DURATION = 4000;
const MARQUEE_SPEED = 32;

// Dùng mét cho địa điểm gần và kilomet cho địa điểm từ 1 km trở lên.
function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

// Hiển thị một category dưới dạng badge và giữ nội dung trên một dòng.
function CategoryBadge({ category }: { category: string }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.categoryBadge,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          theme.typography.overline,
          { color: theme.colors.textSecondary },
        ]}
      >
        {category}
      </Text>
    </View>
  );
}

// Tạo một dãy category để có thể đo chiều rộng và lặp lại khi chạy marquee.
function CategorySequence({ categories, onLayout }: CategorySequenceProps) {
  const theme = useTheme();

  function renderCategory(category: string, index: number) {
    return <CategoryBadge category={category} key={`${category}-${index}`} />;
  }

  return (
    <View
      onLayout={onLayout}
      style={[styles.categorySequence, { gap: theme.spacing.xs }]}
    >
      {categories.map(renderCategory)}
    </View>
  );
}

// Chỉ chạy marquee khi toàn bộ category dài hơn chiều rộng khả dụng.
function CategoryMarquee({ categories }: CategoryMarqueeProps) {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const marqueeGap = theme.spacing.xs;
  const isOverflowing = contentWidth > viewportWidth && viewportWidth > 0;

  function handleViewportLayout(event: LayoutChangeEvent) {
    setViewportWidth(Math.ceil(event.nativeEvent.layout.width));
  }

  function handleContentLayout(event: LayoutChangeEvent) {
    setContentWidth(Math.ceil(event.nativeEvent.layout.width));
  }

  useEffect(
    function startMarquee() {
      translateX.stopAnimation();
      translateX.setValue(0);

      if (!isOverflowing) {
        return undefined;
      }

      const travelDistance = contentWidth + marqueeGap;
      const duration = Math.max(
        MARQUEE_MINIMUM_DURATION,
        (travelDistance / MARQUEE_SPEED) * 1000,
      );
      const marqueeCycle = Animated.sequence([
        Animated.timing(translateX, {
          duration,
          easing: Easing.linear,
          isInteraction: false,
          toValue: -travelDistance,
          useNativeDriver: true,
        }),
        // Giữ tại bản sao trong 20 giây trước khi bắt đầu vòng tiếp theo.
        Animated.delay(MARQUEE_REPEAT_DELAY),
      ]);
      const animation = Animated.sequence([
        Animated.delay(MARQUEE_INITIAL_DELAY),
        Animated.loop(marqueeCycle),
      ]);

      animation.start();

      // Dừng animation khi card bị unmount hoặc kích thước category thay đổi.
      function stopMarquee() {
        animation.stop();
        translateX.setValue(0);
      }

      return stopMarquee;
    },
    [contentWidth, isOverflowing, marqueeGap, translateX],
  );

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
        {/* Đo trực tiếp dãy badge không co lại để nhận đúng chiều rộng nội dung. */}
        <CategorySequence
          categories={categories}
          onLayout={handleContentLayout}
        />

        {isOverflowing ? (
          // Bản sao tạo chuyển động nối tiếp; ẩn khỏi trình đọc màn hình để tránh lặp nội dung.
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
    // Toàn bộ card là vùng nhấn để mở trang chi tiết POI.
    <Pressable
      accessibilityHint="Opens details and narration for this point of interest"
      accessibilityLabel={`${poi.name}, ${formatDistance(poi.distanceMeters)} away`}
      accessibilityRole="button"
      onPress={handlePress}
      style={getCardStyle}
    >
      {/* Ảnh đại diện của POI được crop để luôn lấp đầy khung vuông. */}
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
        {/* Hàng metadata gồm nhiều category bên trái và khoảng cách bên phải. */}
        <View style={[styles.metaRow, { gap: theme.spacing.sm }]}>
          {/* Category giữ trên một dòng và tự chạy khi vượt quá chiều rộng khả dụng. */}
          <CategoryMarquee categories={poi.categories} />

          <View
            style={[
              styles.distance,
              {
                gap: theme.spacing.xs,
                paddingTop: theme.spacing.xs,
              },
            ]}
          >
            <SymbolView
              name={{
                ios: "mappin.circle.fill",
                android: "location_on",
                web: "location_on",
              }}
              size={16}
              tintColor={theme.colors.primaryDark}
            />
            <Text
              style={[
                theme.typography.overline,
                { color: theme.colors.primaryDark },
              ]}
            >
              {formatDistance(poi.distanceMeters)}
            </Text>
          </View>
        </View>

        {/* Tên và mô tả giới hạn một dòng để các card giữ bố cục đồng đều. */}
        <Text
          numberOfLines={1}
          style={[
            theme.typography.sectionTitle,
            { marginTop: theme.spacing.sm },
            { color: theme.colors.textPrimary },
          ]}
        >
          {poi.name}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            theme.typography.caption,
            { marginTop: theme.spacing.xs },
            { color: theme.colors.textSecondary },
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
    alignItems: "flex-start",
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
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
});
