import { Stack } from "expo-router";

import { useStartup } from "@/app/features/startup/hooks/useStartup";
import AppSplash from "@/app/features/startup/components/AppSplash";

export default function RootLayout() {
  const { ready } = useStartup();

  if (!ready) {
    return <AppSplash />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
