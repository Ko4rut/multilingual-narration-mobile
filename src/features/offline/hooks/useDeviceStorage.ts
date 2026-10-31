/**
 * Tính dung lượng bộ nhớ thiết bị dành cho màn hình Offline.
 *
 * Đây là thống kê tổng của thiết bị, KHÔNG phải dung lượng gói PMTiles.
 * Kích thước bản đồ và font được tính riêng trong các bundled services.
 */
import { getFreeDiskStorageAsync, getTotalDiskCapacityAsync } from "expo-file-system/legacy";
import { useEffect, useState } from "react";

import type { DeviceStorageInfo } from "../types/offline.types";

const BYTES_PER_GIBIBYTE = 1024 * 1024 * 1024;

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(function readDeviceStorageEffect() {
    let active = true;

    async function loadStorage(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const [freeBytes, totalBytes] = await Promise.all([
          getFreeDiskStorageAsync(),
          getTotalDiskCapacityAsync(),
        ]);

        if (!active) {
          return;
        }

        const usedBytes = Math.max(0, totalBytes - freeBytes);
        const usedPercentage = calculateUsedPercentage(usedBytes, totalBytes);
        const usedGiB = (usedBytes / BYTES_PER_GIBIBYTE).toFixed(1);
        const totalGiB = (totalBytes / BYTES_PER_GIBIBYTE).toFixed(1);

        setStorage({
          usedBytes,
          totalBytes,
          usedPercentage,
          displayText: usedGiB + " GiB / " + totalGiB + " GiB đã dùng",
        });
      } catch (cause) {
        if (!active) {
          return;
        }

        if (cause instanceof Error) {
          setError(cause);
        } else {
          setError(new Error(String(cause)));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadStorage();

    return function cleanupDeviceStorageEffect() {
      active = false;
    };
  }, []);

  return { storage, isLoading, error };
}
