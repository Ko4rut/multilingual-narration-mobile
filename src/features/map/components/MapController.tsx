/** Điều phối quyền vị trí, camera, map view và các control phủ trên bản đồ. */
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

import { useUserLocation } from "../hooks/useUserLocation";

import { useMapCamera } from "../hooks/useMapCamera";

import { MapLibreMap } from "./MapLibreMap";

import { FocusLocationButton } from "./FocusLocationButton";

import { LocationLoading } from "./LocationLoading";

import { BOTTOM_SHEET_COLLAPSED_HEIGHT } from "../constants/bottomSheet";
import BottomSheet from "./BottomSheet";

export default function MapController() {
  const theme = useTheme();

  const { location, permission } = useUserLocation();

  const { cameraRef, focusLocation } = useMapCamera();

  if (permission === "denied") {
    return <Text> Cần cấp quyền vị trí để hiển thị GPS </Text>;
  }

  if (!location) {
    return <LocationLoading />;
  }

  const userLocation = location;

  function handleFocusUser() {
    focusLocation(userLocation.coords.latitude, userLocation.coords.longitude);
  }

  return (
    <View style={styles.container}>
      <MapLibreMap
        latitude={location.coords.latitude}
        longitude={location.coords.longitude}
        cameraRef={cameraRef}
      />

      <View
        style={[
          styles.controls,
          {
            right: theme.spacing.md + theme.spacing.xs,
            bottom: BOTTOM_SHEET_COLLAPSED_HEIGHT + theme.spacing.md,
          },
        ]}
      >
        <FocusLocationButton onPress={handleFocusUser} />
      </View>

      <BottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  controls: {
    position: "absolute",
    zIndex: 1,
  },
});
