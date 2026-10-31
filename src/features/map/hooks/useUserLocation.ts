/**
 * Xin quyền vị trí và theo dõi GPS.
 *
 * Bản đồ nền độc lập với GPS: từ chối quyền hoặc tắt dịch vụ vị trí
 * không ngăn người dùng xem PMTiles offline.
 */
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useUserLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permission, setPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(function setupLocationTracking() {
    let active = true;
    let subscription: Location.LocationSubscription | null = null;

    function handlePositionUpdate(newLocation: Location.LocationObject): void {
      if (!active) {
        return;
      }

      setLocation(newLocation);
    }

    async function startTracking(): Promise<void> {
      try {
        const permissionResult = await Location.requestForegroundPermissionsAsync();

        if (!active) {
          return;
        }

        setPermission(permissionResult.status);

        if (permissionResult.status !== Location.PermissionStatus.GRANTED) {
          return;
        }

        const enabled = await Location.hasServicesEnabledAsync();

        if (!active || !enabled) {
          return;
        }

        // Không bắt buộc có vị trí đầu tiên để vẽ bản đồ.
        try {
          const initialPosition = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          handlePositionUpdate(initialPosition);
        } catch (cause) {
          console.warn("Chưa lấy được vị trí GPS đầu tiên.", cause);
        }

        if (!active) {
          return;
        }

        const watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          handlePositionUpdate,
        );

        // Permission hoặc component có thể thay đổi khi await đang chạy.
        // Khi đó phải hủy watcher vừa tạo ngay để không rò rỉ subscription.
        if (!active) {
          watcher.remove();
          return;
        }

        subscription = watcher;
      } catch (cause) {
        if (active) {
          console.warn("Không thể khởi động theo dõi vị trí GPS.", cause);
        }
      }
    }

    void startTracking();

    return function stopLocationTracking() {
      active = false;

      if (subscription !== null) {
        subscription.remove();
        subscription = null;
      }
    };
  }, []);

  return { location, permission };
}
