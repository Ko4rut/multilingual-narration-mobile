import { SymbolView } from "expo-symbols";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type PressableStateCallbackType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";

export type SettingsPickerOption = {
  id: string;
  label: string;
};

type SettingsOptionPickerModalProps<Option extends SettingsPickerOption> = {
  accessibilityLabel: string;
  description: string;
  options: Option[];
  selectedOptionId: string;
  title: string;
  visible: boolean;
  getSupportingText?(option: Option): string | undefined;
  onClose(): void;
  onSelect(option: Option): void;
};

type SettingsOptionRowProps<Option extends SettingsPickerOption> = {
  option: Option;
  selected: boolean;
  getSupportingText?(option: Option): string | undefined;
  onSelect(option: Option): void;
};

// Hiển thị một lựa chọn và trạng thái đang được chọn trong danh sách.
function SettingsOptionRow<Option extends SettingsPickerOption>({
  option,
  selected,
  getSupportingText,
  onSelect,
}: SettingsOptionRowProps<Option>) {
  const theme = useTheme();
  const supportingText = getSupportingText?.(option);
  const optionAccessibilityLabel = supportingText
    ? `${option.label}, ${supportingText}`
    : option.label;

  function handlePress() {
    onSelect(option);
  }

  function getRowStyle({ pressed }: PressableStateCallbackType) {
    // Lựa chọn hiện tại dùng màu primary; các hàng khác chỉ đổi màu khi nhấn.
    return [
      styles.optionRow,
      {
        backgroundColor: selected
          ? theme.colors.primaryLight
          : pressed
            ? theme.colors.cardHover
            : theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      },
    ];
  }

  return (
    <Pressable
      accessibilityLabel={optionAccessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={handlePress}
      style={getRowStyle}
    >
      <View style={styles.optionCopy}>
        <Text
          style={[theme.typography.label, { color: theme.colors.textPrimary }]}
        >
          {option.label}
        </Text>

        {supportingText ? (
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textSecondary },
            ]}
          >
            {supportingText}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.selectionIndicator,
          {
            backgroundColor: selected
              ? theme.colors.primary
              : theme.colors.surface,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        {selected ? (
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={16}
            tintColor={theme.colors.white}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function OptionSeparator() {
  const theme = useTheme();

  return <View style={{ height: theme.spacing.sm }} />;
}

// Modal dùng chung cho ngôn ngữ, chất lượng âm thanh và các lựa chọn về sau.
export function SettingsOptionPickerModal<Option extends SettingsPickerOption>({
  accessibilityLabel,
  description,
  options,
  selectedOptionId,
  title,
  visible,
  getSupportingText,
  onClose,
  onSelect,
}: SettingsOptionPickerModalProps<Option>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  function getOptionKey(option: Option) {
    return option.id;
  }

  function renderOption({ item }: ListRenderItemInfo<Option>) {
    return (
      <SettingsOptionRow
        getSupportingText={getSupportingText}
        onSelect={onSelect}
        option={item}
        selected={item.id === selectedOptionId}
      />
    );
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        {/* Nhấn vào lớp phủ sẽ đóng modal mà không thay đổi lựa chọn. */}
        <Pressable
          accessibilityLabel={`Close ${accessibilityLabel}`}
          accessibilityRole="button"
          onPress={onClose}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.overlay },
          ]}
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
          <View
            style={[
              styles.handle,
              {
                backgroundColor: theme.colors.textMuted,
                borderRadius: theme.radius.pill,
                marginTop: theme.spacing.sm,
              },
            ]}
          />

          <View
            style={[
              styles.header,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.md,
              },
            ]}
          >
            <View style={styles.headerCopy}>
              <Text
                style={[
                  theme.typography.heading,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {description}
              </Text>
            </View>

            <Pressable
              accessibilityLabel={`Close ${accessibilityLabel}`}
              accessibilityRole="button"
              hitSlop={12}
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              <SymbolView
                name={{ ios: "xmark", android: "close", web: "close" }}
                size={20}
                tintColor={theme.colors.textPrimary}
              />
            </Pressable>
          </View>

          {/* FlatList chỉ render các lựa chọn đang cần hiển thị trên màn hình. */}
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.sm,
            }}
            data={options}
            extraData={selectedOptionId}
            ItemSeparatorComponent={OptionSeparator}
            keyExtractor={getOptionKey}
            renderItem={renderOption}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "80%",
    overflow: "hidden",
  },
  handle: {
    width: 48,
    height: 4,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCopy: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  optionCopy: {
    flex: 1,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },
});
