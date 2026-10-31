/** MapLibre view backed by the exact same style that was saved for offline use. */
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import {
  REQUIRED_OFFLINE_MAP,
  isWithinRequiredMap,
} from "@/features/offline/constants/requiredMap";
import { HCM_MAP_STYLE } from "../constants/mapStyle";
import type { MapProps } from "../types";
import { UserLocationMarker } from "./UserLocationMarker";

export function MapLibreMap({ latitude, longitude, cameraRef }: MapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const hasLocation = latitude !== undefined && longitude !== undefined;

  // Do not pan outside the downloaded footprint when GPS is in another city.
  useEffect(() => {
    if (
      isMapLoaded &&
      latitude !== undefined &&
      longitude !== undefined &&
      isWithinRequiredMap(latitude, longitude)
    ) {
      cameraRef.current?.easeTo({ center: [longitude, latitude], duration: 500 });
    }
  }, [isMapLoaded, latitude, longitude, cameraRef]);

  return (
    <Map
      style={styles.map}
      mapStyle={HCM_MAP_STYLE}
      attribution
      compass={false}
      logo={false}
      onDidFinishLoadingStyle={() => setIsMapLoaded(true)}
    >
      <Camera
        ref={cameraRef}
        initialViewState={{ center: REQUIRED_OFFLINE_MAP.center, zoom: 13 }}
      />
      {hasLocation && (
        <UserLocationMarker latitude={latitude} longitude={longitude} />
      )}
    </Map>
  );
}

const styles = StyleSheet.create({ map: { flex: 1 } });
