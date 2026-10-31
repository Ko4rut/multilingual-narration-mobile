/**
 * Hiển thị MapLibre chỉ với nguồn PMTiles và glyphs cục bộ.
 * Chặn tâm camera vượt khỏi khu vực đã đóng gói để tránh bản đồ trống.
 */
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { REQUIRED_OFFLINE_MAP, isWithinRequiredMap } from "@/features/offline/constants/requiredMap";
import { useBundledMapResources } from "@/features/offline/context/BundledMapContext";
import { createHcmMapStyle } from "../constants/mapStyle";
import type { MapProps } from "../types";
import { UserLocationMarker } from "./UserLocationMarker";

export function MapLibreMap({ latitude, longitude, cameraRef }: MapProps) {
  const { pmtilesUri, glyphsUrl } = useBundledMapResources();
  const [mapReady, setMapReady] = useState(false);

  const mapStyle = useMemo(
    function buildLocalMapStyle() {
      return createHcmMapStyle(pmtilesUri, glyphsUrl);
    },
    [pmtilesUri, glyphsUrl],
  );

  const hasLocation = latitude !== undefined && longitude !== undefined;
  let locationInsideMap = false;

  if (hasLocation) {
    locationInsideMap = isWithinRequiredMap(latitude, longitude);
  }

  useEffect(function synchronizeGpsCamera() {
    if (!mapReady || !hasLocation || !locationInsideMap) {
      return;
    }

    if (latitude === undefined || longitude === undefined) {
      return;
    }

    cameraRef.current?.easeTo({
      center: [longitude, latitude],
      duration: 500,
    });
  }, [mapReady, hasLocation, locationInsideMap, latitude, longitude, cameraRef]);

  function handleMapStyleLoaded(): void {
    setMapReady(true);
  }

  return (
    <Map
      style={styles.map}
      mapStyle={mapStyle}
      attribution
      compass={false}
      logo={false}
      onDidFinishLoadingStyle={handleMapStyleLoaded}
    >
      <Camera
        ref={cameraRef}
        initialViewState={{ center: REQUIRED_OFFLINE_MAP.center, zoom: 13 }}
        minZoom={REQUIRED_OFFLINE_MAP.minZoom}
        maxZoom={REQUIRED_OFFLINE_MAP.maxZoom}
        maxBounds={REQUIRED_OFFLINE_MAP.bounds}
      />
      {hasLocation && (
        <UserLocationMarker latitude={latitude} longitude={longitude} />
      )}
    </Map>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
