import { useEffect, useState } from "react";
import { getFreeDiskStorageAsync, getTotalDiskCapacityAsync } from "expo-file-system/legacy";
import { DeviceStorageInfo } from "../types/offline.types";

export function useDeviceStorage() {
  const [storage, setStorage] = useState<DeviceStorageInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStorage() {
      try {
        setIsLoading(true);
        const [freeBytes, totalBytes] = await Promise.all([
          getFreeDiskStorageAsync(),
          getTotalDiskCapacityAsync(),
        ]);

        if (!isMounted) return;

        const usedBytes = Math.max(0, totalBytes - freeBytes);
        const usedPercentage =
          totalBytes > 0
            ? Math.min(100, Math.max(0, Math.round((usedBytes / totalBytes) * 100)))
            : 0;

        const usedGB = (usedBytes / 1024 ** 3).toFixed(1);
        const totalGB = (totalBytes / 1024 ** 3).toFixed(0);

        setStorage({
          usedBytes,
          totalBytes,
          usedPercentage,
          displayText: `${usedGB} GB of ${totalGB} GB Used`,
        });
      } catch (err) {
        if (!isMounted) return;
        console.warn("Unable to fetch device storage info:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  return { storage, isLoading, error };
}
