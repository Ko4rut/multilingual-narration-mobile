import { SymbolView } from "expo-symbols";
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableStateCallbackType,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

type SymbolName = ComponentProps<typeof SymbolView>["name"];

// Một row có thể hiển thị value, control tùy chỉnh hoặc chevron điều hướng.
type SettingsRowProps = {
  label: string;
  icon?: SymbolName;
  value?: string;
  control?: ReactNode;
  showChevron?: boolean;
  onPress?(): void;
};

export function SettingsRow({
  label,
  icon,
  value,
  control,
  showChevron = false,
  onPress,
}: SettingsRowProps) {
  const theme = useTheme();

  // Đổi màu nền khi nhấn để cung cấp phản hồi trực quan cho người dùng.
  function getPressedStyle({ pressed }: PressableStateCallbackType) {
    return [
      styles.row,
      {
        backgroundColor: pressed ? theme.colors.cardHover : theme.colors.card,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
        paddingVertical: theme.spacing.sm,
      },
    ];
  }

  // Tách xử lý nhấn khỏi JSX và chỉ gọi callback khi được cung cấp.
  function handlePress() {
    onPress?.();
  }

  // Phần nội dung dùng chung cho cả row tương tác và row chỉ đọc.
  function renderContent() {
    return (
      <>
        <View
          style={[
            styles.labelGroup,
            { gap: theme.spacing.sm + theme.spacing.xs },
          ]}
        >
          {/* Icon là tùy chọn vì một số row hệ thống chỉ cần nhãn văn bản. */}
          {icon ? (
            <SymbolView
              name={icon}
              size={20}
              tintColor={theme.colors.primary}
            />
          ) : null}

          <Text
            style={[
              theme.typography.label,
              styles.label,
              { color: theme.colors.textPrimary },
            ]}
          >
            {label}
          </Text>
        </View>

        <View
          style={[
            styles.trailingGroup,
            {
              gap: theme.spacing.sm,
              marginLeft: theme.spacing.sm + theme.spacing.xs,
            },
          ]}
        >
          {/* Value mô tả lựa chọn hiện tại, ví dụ ngôn ngữ hoặc phiên bản. */}
          {value ? (
            <Text
              numberOfLines={1}
              style={[
                theme.typography.caption,
                styles.value,
                { color: theme.colors.textSecondary },
              ]}
            >
              {value}
            </Text>
          ) : null}

          {control}

          {/* Chevron chỉ xuất hiện với các row dẫn tới lựa chọn hoặc màn hình khác. */}
          {showChevron ? (
            <SymbolView
              name={{
                ios: "chevron.right",
                android: "chevron_right",
                web: "chevron_right",
              }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          ) : null}
        </View>
      </>
    );
  }

  // Có onPress thì dùng Pressable; nếu không, row được render như thông tin chỉ đọc.
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={getPressedStyle}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
          paddingVertical: theme.spacing.sm,
        },
      ]}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelGroup: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flexShrink: 1,
  },
  trailingGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    maxWidth: 152,
  },
});
