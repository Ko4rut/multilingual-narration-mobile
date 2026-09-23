import type { StyleSpecification }
from "@maplibre/maplibre-react-native";


export const OPEN_STREET_MAP_STYLE: StyleSpecification = {
  version: 8,

  sources: {
    openstreetmap: {
      type: "raster",

      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],

      tileSize: 256,
      maxzoom: 19,
    },
  },

  layers:[
    {
      id:"openstreetmap-layer",
      type:"raster",
      source:"openstreetmap",
    }
  ],
};