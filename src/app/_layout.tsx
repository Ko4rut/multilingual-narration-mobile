import { Stack } from "expo-router";

import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Button, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useStartup } from "@/features/startup/hooks/useStartup";
import AppSplash from "@/features/startup/components/AppSplash";

export default function RootLayout() {
  const { ready, error, retry } = useStartup();
  const theme = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch((error) => {
      console.warn("Unable to update root background", error);
    });
  }, [theme.colors.background]);

  if (!ready) {
    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.md, backgroundColor: theme.colors.background }}>
          <ThemedText accessibilityRole="alert">
            Không thể tải tài nguyên khởi động. Vui lòng thử lại.
          </ThemedText>
          <Button title="Thử lại" onPress={retry} color={theme.colors.primary} />
        </View>
      );
    }
    return <AppSplash />;
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: theme.colors.background },
    }} />
  );
}
