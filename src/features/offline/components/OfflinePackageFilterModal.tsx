/** Bottom sheet chọn một Region, Language hoặc Category từ Backend. */
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

import type { OfflineFilterOption } from "../types/offline-package.types";

interface Props {
  visible: boolean;
  title: string;
  selectedId: string | null;
  options: OfflineFilterOption[];
  onSelect(id: string | null): void;
  onClose(): void;
}

export function OfflinePackageFilterModal({
  visible,
  title,
  selectedId,
  options,
  onSelect,
  onClose,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  function chooseOption(id: string | null) {
    onSelect(id);
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Đóng bộ lọc"
          accessibilityRole="button"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
          <View style={[styles.header, { padding: theme.spacing.lg }]}>
            <ThemedText style={theme.typography.heading}>{title}</ThemedText>
            <Pressable accessibilityRole="button" onPress={onClose}>
              <ThemedText color="textSecondary">Đóng</ThemedText>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{
              gap: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.md,
            }}
          >
            <FilterOptionRow
              label="Tất cả"
              selected={selectedId === null}
              onPress={function selectAll() { chooseOption(null); }}
            />
            {options.map(function renderOption(option) {
              return (
                <FilterOptionRow
                  key={option.id}
                  label={option.label}
                  selected={selectedId === option.id}
                  onPress={function selectCurrent() { chooseOption(option.id); }}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function FilterOptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress(): void;
}) {
  const theme = useTheme();
  let backgroundColor = theme.colors.card;
  if (selected) {
    backgroundColor = theme.colors.primaryLight;
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.option,
        {
          borderRadius: theme.radius.md,
          backgroundColor,
          padding: theme.spacing.md,
        },
      ]}
    >
      <ThemedText style={[theme.typography.label, { flex: 1 }, selected && { color: theme.colors.primaryDark }]}>
        {label}
      </ThemedText>
      {selected && <ThemedText style={{ color: theme.colors.primaryDark }}>✓</ThemedText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  sheet: { maxHeight: "75%", overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  option: { flexDirection: "row", alignItems: "center", minHeight: 54 },
});
