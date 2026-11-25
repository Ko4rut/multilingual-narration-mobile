/** Giao diện package discovery, bộ lọc server-side và phân trang. */
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import { useOfflinePackageDiscovery } from "../hooks/useOfflinePackageDiscovery";
import type {
  OfflineFilterKind,
  OfflineFilterOption,
  OfflinePackageCatalog,
  OfflinePackageFilters,
} from "../types/offline-package.types";
import { OfflinePackageCard } from "./OfflinePackageCard";
import { OfflinePackageFilterModal } from "./OfflinePackageFilterModal";

interface FilterConfig {
  title: string;
  allLabel: string;
  options: OfflineFilterOption[];
}

function getFilterConfig(
  kind: OfflineFilterKind,
  catalog: OfflinePackageCatalog,
): FilterConfig {
  if (kind === "regionId") {
    return { title: "Chọn khu vực", allLabel: "Tất cả khu vực", options: catalog.regions };
  }
  if (kind === "languageId") {
    return { title: "Chọn ngôn ngữ", allLabel: "Tất cả ngôn ngữ", options: catalog.languages };
  }
  return { title: "Chọn danh mục", allLabel: "Tất cả danh mục", options: catalog.categories };
}

function getSelectedLabel(
  kind: OfflineFilterKind,
  filters: OfflinePackageFilters,
  catalog: OfflinePackageCatalog,
): string {
  const config = getFilterConfig(kind, catalog);
  const selected = filters[kind];
  if (selected === null) {
    return config.allLabel;
  }

  const match = config.options.find(function matches(option) {
    return option.id === selected;
  });
  return match?.label ?? selected;
}

function getCatalogLabel(
  options: OfflineFilterOption[],
  id: string,
): string {
  return options.find(function matches(option) {
    return option.id === id;
  })?.label ?? id;
}

function FilterButton({
  title,
  value,
  disabled,
  onPress,
}: {
  title: string;
  value: string;
  disabled: boolean;
  onPress(): void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityLabel={title + ": " + value}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.filterButton,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.sm + theme.spacing.xs,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      <ThemedText color="textSecondary" style={theme.typography.caption}>{title}</ThemedText>
      <View style={styles.filterValueRow}>
        <ThemedText style={[theme.typography.label, styles.filterValue]} numberOfLines={1}>
          {value}
        </ThemedText>
        <ThemedText color="textSecondary">⌄</ThemedText>
      </View>
    </Pressable>
  );
}

export function OfflinePackageSection() {
  const theme = useTheme();
  const discovery = useOfflinePackageDiscovery();
  const [activePicker, setActivePicker] = useState<OfflineFilterKind | null>(null);

  function openRegionFilter() { setActivePicker("regionId"); }
  function openLanguageFilter() { setActivePicker("languageId"); }
  function openCategoryFilter() { setActivePicker("categoryId"); }
  function closePicker() { setActivePicker(null); }

  function selectPickerOption(id: string | null) {
    if (activePicker !== null) {
      discovery.selectFilter(activePicker, id);
    }
  }

  const currentConfig = activePicker === null
    ? null
    : getFilterConfig(activePicker, discovery.catalog);

  let selectedPickerId: string | null = null;
  if (activePicker !== null) {
    selectedPickerId = discovery.filters[activePicker];
  }

  const filtersUnavailable = discovery.isCatalogLoading || discovery.catalogError !== null;
  const hasFilters = Object.values(discovery.filters).some(function hasValue(value) {
    return value !== null;
  });

  return (
    <View style={[styles.section, { marginTop: theme.spacing.lg }]}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <ThemedText style={theme.typography.heading}>Gói thuyết minh</ThemedText>
          <ThemedText color="textSecondary" style={theme.typography.caption}>
            Khám phá các gói dữ liệu đã phát hành từ máy chủ.
          </ThemedText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Làm mới danh sách gói" onPress={discovery.refresh}>
          <ThemedText style={[theme.typography.caption, { color: theme.colors.primaryDark }]}>
            Làm mới ↻
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <FilterButton
          title="Khu vực"
          value={getSelectedLabel("regionId", discovery.filters, discovery.catalog)}
          disabled={filtersUnavailable}
          onPress={openRegionFilter}
        />
        <FilterButton
          title="Ngôn ngữ"
          value={getSelectedLabel("languageId", discovery.filters, discovery.catalog)}
          disabled={filtersUnavailable}
          onPress={openLanguageFilter}
        />
      </View>
      <FilterButton
        title="Danh mục (tùy chọn)"
        value={getSelectedLabel("categoryId", discovery.filters, discovery.catalog)}
        disabled={filtersUnavailable}
        onPress={openCategoryFilter}
      />

      {discovery.catalogError !== null && (
        <View style={styles.feedback}>
          <ThemedText color="textSecondary" style={theme.typography.caption}>
            Không tải được bộ lọc: {discovery.catalogError}
          </ThemedText>
          <Pressable accessibilityRole="button" onPress={discovery.refresh}>
            <ThemedText style={{ color: theme.colors.primaryDark }}>Thử lại</ThemedText>
          </Pressable>
        </View>
      )}

      <View style={styles.summaryRow}>
        <ThemedText style={theme.typography.sectionTitle}>Danh sách gói</ThemedText>
        <ThemedText color="textSecondary" style={theme.typography.caption}>
          {discovery.total} gói
        </ThemedText>
      </View>

      {discovery.isLoading && !discovery.isLoadingMore && (
        <View style={styles.feedback}>
          <ActivityIndicator color={theme.colors.primary} />
          <ThemedText color="textSecondary">Đang tải danh sách gói...</ThemedText>
        </View>
      )}
      {discovery.errorMessage !== null && (
        <View style={styles.feedback}>
          <ThemedText color="textSecondary">{discovery.errorMessage}</ThemedText>
          <Pressable accessibilityRole="button" onPress={discovery.refresh}>
            <ThemedText style={{ color: theme.colors.primaryDark }}>Thử lại</ThemedText>
          </Pressable>
        </View>
      )}
      {!discovery.isLoading && discovery.errorMessage === null && discovery.packages.length === 0 && (
        <View style={styles.feedback}>
          <ThemedText color="textSecondary">Không có gói nào phù hợp với bộ lọc.</ThemedText>
          {hasFilters && (
            <Pressable accessibilityRole="button" onPress={discovery.clearFilters}>
              <ThemedText style={{ color: theme.colors.primaryDark }}>Xóa bộ lọc</ThemedText>
            </Pressable>
          )}
        </View>
      )}

      {discovery.packages.map(function renderPackage(item) {
        return (
          <OfflinePackageCard
            key={item.id}
            item={item}
            regionName={getCatalogLabel(discovery.catalog.regions, item.regionId)}
            languageName={getCatalogLabel(discovery.catalog.languages, item.languageId)}
          />
        );
      })}

      {discovery.hasMore && discovery.errorMessage === null && (
        <Pressable
          accessibilityRole="button"
          disabled={discovery.isLoading}
          onPress={discovery.loadMore}
          style={[
            styles.loadMore,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              opacity: discovery.isLoading ? 0.6 : 1,
            },
          ]}
        >
          {discovery.isLoadingMore
            ? <ActivityIndicator color={theme.colors.primary} />
            : <ThemedText style={[theme.typography.label, { color: theme.colors.primaryDark }]}>Xem thêm gói</ThemedText>}
        </Pressable>
      )}

      <ThemedText color="textMuted" style={theme.typography.caption}>
        Đây là danh sách trên Backend. Tải và lưu gói vào thiết bị sẽ được triển khai sau.
      </ThemedText>

      <OfflinePackageFilterModal
        visible={activePicker !== null}
        title={currentConfig?.title ?? ""}
        selectedId={selectedPickerId}
        options={currentConfig?.options ?? []}
        onSelect={selectPickerOption}
        onClose={closePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  titleCopy: { flex: 1, gap: 6 },
  filterRow: { flexDirection: "row", gap: 10 },
  filterButton: { flex: 1, minWidth: 0, borderWidth: 1, gap: 4 },
  filterValueRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  filterValue: { flex: 1 },
  summaryRow: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  feedback: { paddingVertical: 18, gap: 10, alignItems: "center" },
  loadMore: { borderWidth: 1, alignItems: "center" },
});
