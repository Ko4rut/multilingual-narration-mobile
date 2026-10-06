/** Đọc dung lượng đĩa qua Expo FileSystem và chuẩn hóa dữ liệu cho UI. */
import { getFreeDiskStorageAsync, getTotalDiskCapacityAsync } from "expo-file-system/legacy";
import { useEffect, useState } from "react";
import { DeviceStorageInfo } from "../types/offline.types";

const ONE_GB_IN_BYTES = 1024 * 1024 * 1024;

function calculateUsedPercentage(usedBytes: number, totalBytes: number): number {
  if (totalBytes <= 0) {
    return 0;
  }
  const percentage = Math.round((usedBytes / totalBytes) * 100);
  if (percentage < 0) {
    return 0;
  }
  if (percentage > 100) {
    return 100;
  }
  return percentage;
}

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
        const usedPercentage = calculateUsedPercentage(usedBytes, totalBytes);

        const usedGB = (usedBytes / ONE_GB_IN_BYTES).toFixed(1);
        const totalGB = Math.round(totalBytes / ONE_GB_IN_BYTES);

        setStorage({
          usedBytes,
          totalBytes,
          usedPercentage,
          displayText: `${usedGB} GB of ${totalGB} GB Used`,
        });
      } catch (err) {
        if (!isMounted) return;
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
