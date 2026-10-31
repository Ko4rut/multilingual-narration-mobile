/**
 * Ghép bản đồ offline với quyền GPS và các điều khiển tương tác.
 * GPS chỉ được dùng để hiển thị vị trí, không quyết định việc nạp PMTiles.
 */
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { isWithinRequiredMap } from "@/features/offline/constants/requiredMap";

import { BOTTOM_SHEET_COLLAPSED_HEIGHT } from "../constants/bottomSheet";
import { useMapCamera } from "../hooks/useMapCamera";
import { useUserLocation } from "../hooks/useUserLocation";
import BottomSheet from "./BottomSheet";
import { FocusLocationButton } from "./FocusLocationButton";
import { MapLibreMap } from "./MapLibreMap";

export default function MapController() {
  const theme = useTheme();
  const { location, permission } = useUserLocation();
  const { cameraRef, focusLocation } = useMapCamera();

  let latitude: number | undefined;
  let longitude: number | undefined;
  let canFocus = false;

  if (location !== null) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    canFocus = isWithinRequiredMap(latitude, longitude);
  }

  function focusOnCurrentPosition(): void {
    if (!canFocus || latitude === undefined || longitude === undefined) {
      return;
    }

    focusLocation(latitude, longitude);
  }

  return (
    <View style={styles.container}>
      <MapLibreMap
        latitude={latitude}
        longitude={longitude}
        cameraRef={cameraRef}
      />

      {permission === LocationPermissionDenied && (
        <Text
          style={[
            styles.permissionNotice,
            {
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.card,
            },
          ]}
        >
          Bạn vẫn xem được bản đồ offline; bật GPS để xác định vị trí của mình.
        </Text>
      )}

      {canFocus && (
        <View
          style={[
            styles.controls,
            {
              right: theme.spacing.md + theme.spacing.xs,
              bottom: BOTTOM_SHEET_COLLAPSED_HEIGHT + theme.spacing.md,
            },
          ]}
        >
          <FocusLocationButton onPress={focusOnCurrentPosition} />
        </View>
      )}

      <BottomSheet />
    </View>
  );
}

const LocationPermissionDenied = "denied";

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { position: "absolute", zIndex: 1 },
  permissionNotice: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 10,
    zIndex: 1,
  },
});
