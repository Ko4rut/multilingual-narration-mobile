import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type SettingsSectionProps = PropsWithChildren<{
  title: string;
}>;

// Gom các SettingsRow liên quan dưới cùng một tiêu đề và khoảng cách thống nhất.
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md + theme.spacing.xs,
      }}
    >
      {/* Tiêu đề section dùng typography chung của ứng dụng. */}
      <Text
        style={[
          theme.typography.sectionTitle,
          { color: theme.colors.textPrimary },
        ]}
      >
        {title}
      </Text>

      {/* Khoảng cách giữa các row được quản lý tại đây thay vì từng row riêng lẻ. */}
      <View style={{ gap: theme.spacing.sm + theme.spacing.xs }}>
        {children}
      </View>
    </View>
  );
}
