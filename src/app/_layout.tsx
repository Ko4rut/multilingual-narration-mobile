/**
 * Root layout chỉ mở điều hướng khi tài nguyên UI và bản đồ offline đã sẵn sàng.
 *
 * Hai quy trình khởi tạo độc lập:
 * - useStartup: font và hình ảnh giao diện;
 * - useOfflineResources: PMTiles và Noto Sans glyphs được đóng gói trong APK.
 */
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { BundledMapUriContext } from "@/features/offline/context/BundledMapContext";
import { useOfflineResources } from "@/features/offline/hooks/useOfflineResources";
import AppSplash from "@/features/startup/components/AppSplash";
import { useStartup } from "@/features/startup/hooks/useStartup";

void SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function RootLayout() {
  const startup = useStartup();
  const offline = useOfflineResources();
  const theme = useTheme();

  useEffect(function hideNativeSplashWhenReady() {
    if (startup.ready || startup.error) {
      SplashScreen.hide();
    }
  }, [startup.ready, startup.error]);

  useEffect(function synchronizeSystemBackground() {
    async function applyBackgroundColor(): Promise<void> {
      try {
        await SystemUI.setBackgroundColorAsync(theme.colors.background);
      } catch (cause) {
        console.warn("Không thể cập nhật màu nền ứng dụng.", cause);
      }
    }

    void applyBackgroundColor();
  }, [theme.colors.background]);

  function retryInitialization(): void {
    if (startup.error) {
      startup.retry();
      return;
    }

    offline.retry();
  }

  function getInitializationError(): string | null {
    if (startup.error) {
      return startup.error.message;
    }

    return offline.errorMessage;
  }

  const errorMessage = getInitializationError();

  if (errorMessage !== null) {
    return (
      <View
        style={[
          styles.errorScreen,
          {
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <ThemedText accessibilityRole="alert">
          Không thể chuẩn bị ứng dụng: {errorMessage}
        </ThemedText>
        <Button title="Thử lại" onPress={retryInitialization} color={theme.colors.primary} />
      </View>
    );
  }

  if (!startup.ready || offline.phase !== "ready" || offline.resources === null) {
    return <AppSplash />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BundledMapUriContext.Provider value={offline.resources}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
      </BundledMapUriContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorScreen: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
});
