/** On-device Protomaps v4 vector basemap; no network glyphs, sprites or tiles. */
import type { StyleSpecification } from "@maplibre/maplibre-react-native";
export const HCM_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    hcm: {
      type: "vector",
      url: "pmtiles://asset://hcm-metropolitan.pmtiles",
      minzoom: 0,
      maxzoom: 15,
      attribution: "© OpenStreetMap contributors · Protomaps",
    },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#f3efe8" } },
    {
      id: "parks", type: "fill", source: "hcm", "source-layer": "landuse",
      filter: ["in", ["get", "kind"], ["literal", ["park", "garden", "grass", "forest", "recreation_ground"]]],
      paint: { "fill-color": "#d8e8ce" },
    },
    { id: "water", type: "fill", source: "hcm", "source-layer": "water", paint: { "fill-color": "#b3d9e8" } },
    {
      id: "buildings", type: "fill", source: "hcm", "source-layer": "buildings", minzoom: 14,
      paint: { "fill-color": "#dfd5ca", "fill-outline-color": "#cfc3b6" },
    },
    {
      id: "roads-outline", type: "line", source: "hcm", "source-layer": "roads",
      paint: { "line-color": "#d1c7b9", "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 13, 2, 16, 6] },
    },
    {
      id: "roads", type: "line", source: "hcm", "source-layer": "roads",
      paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.5, 13, 1.2, 16, 4.5] },
    },
  ],
};
