/** Adapter for offline MapLibre rendering with a fully-local PMTiles source. */
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useBundledMapResources } from "@/features/offline/context/BundledMapContext";
import { REQUIRED_OFFLINE_MAP, isWithinRequiredMap } from "@/features/offline/constants/requiredMap";
import { createHcmMapStyle } from "../constants/mapStyle";
import type { MapProps } from "../types";
import { UserLocationMarker } from "./UserLocationMarker";

export function MapLibreMap({ latitude, longitude, cameraRef }: MapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { pmtilesUri, glyphsUrl } = useBundledMapResources();
  const mapStyle = useMemo(() => createHcmMapStyle(pmtilesUri, glyphsUrl), [pmtilesUri, glyphsUrl]);
  const hasLocation = latitude !== undefined && longitude !== undefined;

  useEffect(() => {
    if (isMapLoaded && latitude !== undefined && longitude !== undefined
      && isWithinRequiredMap(latitude, longitude)) {
      cameraRef.current?.easeTo({ center: [longitude, latitude], duration: 500 });
    }
  }, [isMapLoaded, latitude, longitude, cameraRef]);

  return (
    <Map
      style={styles.map}
      mapStyle={mapStyle}
      attribution
      compass={false}
      logo={false}
      onDidFinishLoadingStyle={() => setIsMapLoaded(true)}
    >
      <Camera
        ref={cameraRef}
        initialViewState={{ center: REQUIRED_OFFLINE_MAP.center, zoom: 13 }}
      />
      {hasLocation && <UserLocationMarker latitude={latitude} longitude={longitude} />}
    </Map>
  );
}
const styles = StyleSheet.create({ map: { flex: 1 } });
