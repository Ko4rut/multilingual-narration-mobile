import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableStateCallbackType,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

type PoiCardProps = {
  poi: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    distanceMeters: number;
    categories: string[];
  };
  onPress?(poi: PoiCardProps["poi"]): void;
};

// Dùng mét cho địa điểm gần và kilomet cho địa điểm từ 1 km trở lên.
function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) return `${distanceMeters}m`;
  return `${(distanceMeters / 1000).toFixed(1)}km`;
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

  function renderCategory(category: string) {
    return (
      <View
        key={category}
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
          <View style={[styles.categories, { gap: theme.spacing.xs }]}>
            {/* Một POI có thể thuộc nhiều category nên render toàn bộ thành badge. */}
            {poi.categories.map(renderCategory)}
          </View>

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
  categories: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryBadge: {
    maxWidth: 128,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
});
