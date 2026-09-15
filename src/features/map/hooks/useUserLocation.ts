import * as Location from "expo-location";
import { useEffect, useState } from "react";
export function useUserLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permission, setPermission] = useState<Location.PermissionStatus | null>(null);
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    async function startTracking() {
      const result = await Location.requestForegroundPermissionsAsync();
      setPermission(result.status);
      if (result.status !== Location.PermissionStatus.GRANTED) return;
      setLocation(await Location.getCurrentPositionAsync({}));
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 }, setLocation,
      );
    }
    startTracking();
    return () => subscription?.remove();
  }, []);
  return { location, permission };
}
