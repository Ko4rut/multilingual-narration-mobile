import {
  GeoJSONSource,
  Layer,
} from "@maplibre/maplibre-react-native";

import type {
  UserLocationMarkerProps,
} from "../types";


export function UserLocationMarker({
  latitude,
  longitude,
}: UserLocationMarkerProps) {

  return (
    <GeoJSONSource
      id="user-location-source"
      data={{
        type: "Feature",
        properties: {},

        geometry: {
          type: "Point",

          coordinates: [
            longitude,
            latitude,
          ],
        },
      }}
    >
      <Layer
        id="user-location-marker"
        type="circle"

        paint={{
          "circle-radius": 10,
          "circle-color": "#2563eb",
          "circle-stroke-width": 3,
          "circle-stroke-color": "white",
        }}
      />

    </GeoJSONSource>
  );
}