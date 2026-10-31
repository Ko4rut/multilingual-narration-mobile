/**
 * Chuẩn bị các tài nguyên giao diện trước khi hiển thị màn hình chính.
 *
 * Dữ liệu bản đồ PMTiles và glyphs có vòng đời riêng, được chuẩn bị bởi
 * useOfflineResources; hook này chỉ xử lý font và hình ảnh của UI.
 */
import { loadTabIcons } from "@/constants/tab-icons";
import { FontFamily } from "@/constants/theme";
import { loadAsync as loadFontsAsync } from "expo-font";
import { useEffect, useState } from "react";

import { loadStartupImages } from "../services/startup-images";

export function useStartup() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(function prepareStartupResourcesEffect() {
    let active = true;

    async function prepareStartupResources(): Promise<void> {
      setError(null);

      try {
        await Promise.all([
          loadFontsAsync({
            [FontFamily.regular]: require("@/assets/fonts/Lora-Regular.ttf"),
            [FontFamily.bold]: require("@/assets/fonts/Lora-Bold.ttf"),
          }),
          loadStartupImages(),
          loadTabIcons(),
        ]);

        if (active) {
          setReady(true);
        }
      } catch (cause) {
        if (!active) {
          return;
        }

        if (cause instanceof Error) {
          setError(cause);
          return;
        }

        setError(new Error(String(cause)));
      }
    }

    void prepareStartupResources();

    return function cleanupStartupResourcesEffect() {
      active = false;
    };
  }, [attempt]);

  function retry(): void {
    setReady(false);
    setError(null);
    setAttempt(function increaseAttempt(previousAttempt) {
      return previousAttempt + 1;
    });
  }

  return { ready, error, retry };
}
