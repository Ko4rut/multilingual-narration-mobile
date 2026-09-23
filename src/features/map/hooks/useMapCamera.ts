import { useRef } from "react";

import type {
  CameraRef,
} from "@maplibre/maplibre-react-native";


export function useMapCamera() {

  const cameraRef =
    useRef<CameraRef>(null);


  function focusLocation(
    latitude: number,
    longitude: number
  ) {

    cameraRef.current?.easeTo({

      center: [
        longitude,
        latitude,
      ],

      zoom: 16,

      duration: 500,

    });

  }


  return {
    cameraRef,
    focusLocation,
  };

}