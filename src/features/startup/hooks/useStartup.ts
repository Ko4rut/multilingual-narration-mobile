import { useCallback, useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { loadAsync as loadFontsAsync } from "expo-font";

import { loadTabIcons } from "@/constants/tab-icons";
import { startupImages } from "../constants/startup-assets";

function mock_delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useStartup() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function prepare() {
      try {
        await Promise.all([
          loadFontsAsync({
            "Lora-Regular": require("@/assets/fonts/Lora-Regular.ttf"),
            "Lora-Bold": require("@/assets/fonts/Lora-Bold.ttf"),
          }),
          Asset.loadAsync(startupImages.splashLogo),
          loadTabIcons(),

          mock_delay(5000)
        ]);
        if (!cancelled) setReady(true);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause : new Error(String(cause)));
        }
      }
    }

    void prepare();
    return () => { cancelled = true; };
  }, [attempt]);

  return { ready, error, retry };
}
