import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useUserLocation,
} from "../hooks/useUserLocation";

import {
  useMapCamera,
} from "../hooks/useMapCamera";

import {
  MapLibreMap,
} from "./MapLibreMap";

import {
  FocusLocationButton,
} from "./FocusLocationButton";

import {
  LocationLoading,
} from "./LocationLoading";


export default function MapController() {

  const {
    location,
    permission,
  } = useUserLocation();


  const {
    cameraRef,
    focusLocation,
  } = useMapCamera();



  if (permission === "denied") {

    return (
      <Text>
        Cần cấp quyền vị trí để hiển thị GPS
      </Text>
    );

  }


  if (!location) {

    return (
      <LocationLoading />
    );

  }

  const userLocation = location;



  function handleFocusUser() {

    focusLocation(
      userLocation.coords.latitude,
      userLocation.coords.longitude
    );


  }


  return (

    <View style={styles.container}>

      <MapLibreMap

        latitude={
          location.coords.latitude
        }

        longitude={
          location.coords.longitude
        }

        cameraRef={
          cameraRef
        }

      />


      <View style={styles.controls}>

        <FocusLocationButton

          onPress={
            handleFocusUser
          }

        />

      </View>

    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },


  controls: {
    position: "absolute",

    right: 20,

    bottom: 40,
  },

});