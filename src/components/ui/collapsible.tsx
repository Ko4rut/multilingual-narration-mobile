/**
 * Khối nội dung có thể mở rộng.
 *
 * Đồng bộ với API theme hiện tại: ThemedView không có prop "type",
 * ThemedText dùng style và useTheme trả về nhóm colors/spacing.
 */
import { SymbolView } from "expo-symbols";
import { type PropsWithChildren, useState } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableStateCallbackType,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

type CollapsibleProps = PropsWithChildren<{ title: string }>;

function getHeadingStyle(state: PressableStateCallbackType) {
  if (state.pressed) {
    return [styles.heading, styles.pressedHeading];
  }

  return [styles.heading];
}

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  let iconRotation: "90deg" | "-90deg" = "90deg";
  if (isOpen) {
    iconRotation = "-90deg";
  }

  function toggleOpen(): void {
    setIsOpen(function invert(previousOpen) {
      return !previousOpen;
    });
  }

  return (
    <ThemedView>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        style={getHeadingStyle}
        onPress={toggleOpen}
      >
        <ThemedView
          style={[
            styles.button,
            {
              width: theme.spacing.lg,
              height: theme.spacing.lg,
              backgroundColor: theme.colors.card,
            },
          ]}
        >
          <SymbolView
            name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
            size={14}
            weight="bold"
            tintColor={theme.colors.textPrimary}
            style={{ transform: [{ rotate: iconRotation }] }}
          />
        </ThemedView>
        <ThemedText style={theme.typography.caption}>{title}</ThemedText>
      </Pressable>

      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView
            style={[
              styles.content,
              {
                marginTop: theme.spacing.sm,
                marginLeft: theme.spacing.lg,
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.card,
              },
            ]}
          >
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressedHeading: { opacity: 0.7 },
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {},
});
