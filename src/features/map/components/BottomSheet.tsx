/** Bottom sheet tìm kiếm và hiển thị các POI gần khu vực bản đồ. */
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
} from "react-native";

import { SymbolView } from "expo-symbols";

import { GestureDetector } from "react-native-gesture-handler";

import Animated from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";

import { MOCK_POIS } from "../data/mock-pois";
import { useBottomSheet } from "../hooks/useBottomSheet";
import { usePoiSearch } from "../hooks/usePoiSearch";
import type { PointOfInterest } from "../types";
import { PoiCard } from "./PoiCard";

type BottomSheetProps = {
  pois?: PointOfInterest[];
  onPoiPress?(poi: PointOfInterest): void;
};

function PoiSeparator() {
  const theme = useTheme();

  return <View style={{ height: theme.spacing.sm + theme.spacing.xs }} />;
}

export default function BottomSheet({
  pois = MOCK_POIS,
  onPoiPress,
}: BottomSheetProps) {
  const theme = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const { animatedSheetStyle, panGesture, sheetHeight, toggleSheet } =
    useBottomSheet(screenHeight);
  const { clearSearch, filteredPois, searchQuery, setSearchQuery } =
    usePoiSearch(pois);

  function getPoiKey(poi: PointOfInterest) {
    return poi.id;
  }

  function renderPoi({ item }: ListRenderItemInfo<PointOfInterest>) {
    return <PoiCard poi={item} onPress={onPoiPress} />;
  }

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          height: sheetHeight,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderTopLeftRadius: theme.radius.lg,
          borderTopRightRadius: theme.radius.lg,
          shadowColor: theme.colors.shadow,
        },
        theme.shadows.floating,
        animatedSheetStyle,
      ]}
    >
      {/* Thanh kéo: hỗ trợ cả thao tác pan và nhấn để đóng và mở. */}
      <GestureDetector gesture={panGesture}>
        <Pressable
          accessibilityHint="Expands or collapses the nearby places list"
          accessibilityLabel="Nearby points of interest"
          accessibilityRole="button"
          onPress={toggleSheet}
          style={[styles.dragArea, { height: theme.spacing.xl }]}
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor: theme.colors.textPrimary,
                borderRadius: theme.radius.pill,
              },
            ]}
          />
        </Pressable>
      </GestureDetector>

      {/* Ô tìm kiếm luôn nằm phía trên danh sách POI. */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.md,
            gap: theme.spacing.sm,
            marginHorizontal: theme.spacing.md + theme.spacing.xs,
            marginBottom: theme.spacing.sm + theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
          },
        ]}
      >
        <SymbolView
          name={{ ios: "magnifyingglass", android: "search", web: "search" }}
          size={20}
          tintColor={theme.colors.textSecondary}
        />
        <TextInput
          accessibilityLabel="Search points of interest"
          onChangeText={setSearchQuery}
          placeholder="Search point of interest..."
          placeholderTextColor={theme.colors.textSecondary}
          returnKeyType="search"
          style={[
            theme.typography.supporting,
            styles.searchInput,
            { color: theme.colors.textPrimary },
          ]}
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            hitSlop={12}
            onPress={clearSearch}
          >
            <SymbolView
              name={{
                ios: "xmark.circle.fill",
                android: "cancel",
                web: "cancel",
              }}
              size={20}
              tintColor={theme.colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* FlatList chỉ render các card đang hiển thị, phù hợp khi số POI tăng lớn. */}
      <FlatList
        contentContainerStyle={[
          {
            paddingHorizontal: theme.spacing.md + theme.spacing.xs,
            paddingBottom: theme.spacing.lg,
          },
          filteredPois.length === 0 && styles.emptyListContent,
        ]}
        data={filteredPois}
        ItemSeparatorComponent={PoiSeparator}
        keyboardShouldPersistTaps="handled"
        keyExtractor={getPoiKey}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyState,
              { paddingBottom: theme.spacing.lg + theme.spacing.xs },
            ]}
          >
            <SymbolView
              name={{
                ios: "mappin.slash",
                android: "location_off",
                web: "location_off",
              }}
              size={28}
              tintColor={theme.colors.textMuted}
            />
            <Text
              style={[
                theme.typography.bodyStrong,
                { marginTop: theme.spacing.sm },
                { color: theme.colors.textPrimary },
              ]}
            >
              No points of interest found
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { marginTop: theme.spacing.xs },
                { color: theme.colors.textSecondary },
              ]}
            >
              Try searching for another name or category.
            </Text>
          </View>
        }
        nestedScrollEnabled
        renderItem={renderPoi}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 2,
  },
  dragArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 64,
    height: 4,
    opacity: 0.9,
  },
  searchBox: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
  },
  list: {
    flex: 1,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
