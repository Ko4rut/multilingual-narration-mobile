import { StyleSheet, Text, View } from "react-native";

import { useUserLocation } from "../hooks/useUserLocation";
import { LeafletMap } from "./LeafletMap";

export default function MapScreen() {
  const { location, permission } = useUserLocation();

//   let statusMessage = "";

//   if (permission === "denied") {
//     statusMessage = "Cần cấp quyền vị trí để hiển thị GPS";
//   } else if (permission === null) {
//     statusMessage = "Đang xin quyền truy cập vị trí...";
//   }

  return (
    <View style={styles.container}>
      <LeafletMap
        latitude={location?.coords.latitude}
        longitude={location?.coords.longitude}
      />

      {/* <Text style={styles.status}>{statusMessage}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  status: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
