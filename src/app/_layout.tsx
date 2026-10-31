import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Button, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useStartup } from "@/features/startup/hooks/useStartup";
import { useRequiredOfflineMap } from "@/features/offline/hooks/useRequiredOfflineMap";
import AppSplash from "@/features/startup/components/AppSplash";
import RequiredMapDownloadScreen from "@/features/startup/components/RequiredMapDownloadScreen";

void SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function RootLayout() {
  const { ready, error, retry } = useStartup();
  const requiredMap = useRequiredOfflineMap();
  const theme = useTheme();

  useEffect(() => {
    if (ready || error) SplashScreen.hide();
  }, [ready, error]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch((cause) => {
      console.warn("Unable to update root background", cause);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      {requiredMap.phase !== "ready" ? (
        <RequiredMapDownloadScreen
          phase={requiredMap.phase}
          progress={requiredMap.progress}
          error={requiredMap.error}
          onRetry={requiredMap.retry}
        />
      ) : (
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }} />
      )}
    </GestureHandlerRootView>
  );
}
