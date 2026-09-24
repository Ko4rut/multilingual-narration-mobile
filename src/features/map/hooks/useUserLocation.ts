import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useUserLocation() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [permission, setPermission] =
    useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      console.log("========== GPS START ==========");

      // 1. Request permission
      const permissionResult =
        await Location.requestForegroundPermissionsAsync();

      console.log(
        "Permission status:",
        permissionResult.status
      );

      setPermission(permissionResult.status);

      if (
        permissionResult.status !==
        Location.PermissionStatus.GRANTED
      ) {
        console.log("GPS permission denied");
        return;
      }

      console.log("Permission granted");

      // 2. Check location service
      const serviceEnabled =
        await Location.hasServicesEnabledAsync();

      console.log(
        "Location service enabled:",
        serviceEnabled
      );

      if (!serviceEnabled) {
        console.log("Android Location Service OFF");
        return;
      }

      // 3. Get current location
      try {
        console.log(
          "Getting current position..."
        );

        const current =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        console.log(
          "CURRENT LOCATION:",
          {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
            accuracy: current.coords.accuracy,
          }
        );

        setLocation(current);

      } catch (error) {
        console.log(
          "GET CURRENT LOCATION ERROR:",
          error
        );
      }


      // 4. Watch location continuously
      subscription =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },

          (newLocation) => {
            console.log(
              "LOCATION UPDATE:",
              {
                latitude:
                  newLocation.coords.latitude,

                longitude:
                  newLocation.coords.longitude,

                accuracy:
                  newLocation.coords.accuracy,
              }
            );

            setLocation(newLocation);
          }
        );

      console.log(
        "GPS tracking started"
      );
    }


    startTracking();


    return () => {
      console.log(
        "GPS subscription removed"
      );

      subscription?.remove();
    };

  }, []);


  return {
    location,
    permission,
  };
}