import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Button, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useStartup } from "@/features/startup/hooks/useStartup";
import { prepareBundledMap } from "@/features/offline/services/bundledMap";
import { BundledMapUriContext } from "@/features/offline/context/BundledMapContext";
import AppSplash from "@/features/startup/components/AppSplash";

void SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function RootLayout() {
  const { ready, error, retry } = useStartup();
  const [mapUri, setMapUri] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapAttempt, setMapAttempt] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (ready || error) SplashScreen.hide();
  }, [ready, error]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch((cause) => {
      console.warn("Unable to update root background", cause);
    });
  }, [theme.colors.background]);

  useEffect(() => {
    let mounted = true;
    setMapError(null);
    void prepareBundledMap()
      .then((uri) => { if (mounted) setMapUri(uri); })
      .catch((cause) => {
        if (mounted) setMapError(cause instanceof Error ? cause.message : String(cause));
      });
    return () => { mounted = false; };
  }, [mapAttempt]);

  if (!ready || !mapUri) {
    const reason = error?.message ?? mapError;
    if (reason) {
      return (
        <View style={{ flex: 1, justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.md, backgroundColor: theme.colors.background }}>
          <ThemedText accessibilityRole="alert">Không thể chuẩn bị ứng dụng: {reason}</ThemedText>
          <Button
            title="Thử lại"
            onPress={() => { if (error) retry(); else setMapAttempt((n) => n + 1); }}
            color={theme.colors.primary}
          />
        </View>
      );
    }
    return <AppSplash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BundledMapUriContext.Provider value={mapUri}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
      </BundledMapUriContext.Provider>
    </GestureHandlerRootView>
  );
}
