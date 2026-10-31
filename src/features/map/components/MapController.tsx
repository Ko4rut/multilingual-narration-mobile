/** Show the downloaded map even when GPS is unavailable or permission was denied. */
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { isWithinRequiredMap } from "@/features/offline/constants/requiredMap";
import { useUserLocation } from "../hooks/useUserLocation";
import { useMapCamera } from "../hooks/useMapCamera";
import { MapLibreMap } from "./MapLibreMap";
import { FocusLocationButton } from "./FocusLocationButton";
import { BOTTOM_SHEET_COLLAPSED_HEIGHT } from "../constants/bottomSheet";
import BottomSheet from "./BottomSheet";

export default function MapController() {
  const theme = useTheme();
  const { location, permission } = useUserLocation();
  const { cameraRef, focusLocation } = useMapCamera();

  const canFocus = Boolean(
    location && isWithinRequiredMap(location.coords.latitude, location.coords.longitude),
  );

  return (
    <View style={styles.container}>
      <MapLibreMap
        latitude={location?.coords.latitude}
        longitude={location?.coords.longitude}
        cameraRef={cameraRef}
      />

      {permission === "denied" && (
        <Text style={[styles.permissionNotice, { color: theme.colors.textPrimary, backgroundColor: theme.colors.card }]}>
          Bạn vẫn xem được bản đồ offline; bật GPS để xác định vị trí của mình.
        </Text>
      )}

      {canFocus && location && (
        <View
          style={[
            styles.controls,
            {
              right: theme.spacing.md + theme.spacing.xs,
              bottom: BOTTOM_SHEET_COLLAPSED_HEIGHT + theme.spacing.md,
            },
          ]}
        >
          <FocusLocationButton
            onPress={() => focusLocation(location.coords.latitude, location.coords.longitude)}
          />
        </View>
      )}
      <BottomSheet />
    </View>
  );
}

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
