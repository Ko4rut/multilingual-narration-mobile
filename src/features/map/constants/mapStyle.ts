/** Fully local Protomaps v4 vector basemap sourced from an app-local PMTiles file. */
import type { StyleSpecification } from "@maplibre/maplibre-react-native";

export function createHcmMapStyle(pmtilesUri: string, glyphsUrl: string): StyleSpecification {
  if (!pmtilesUri.startsWith("pmtiles://file://")) {
    throw new Error("MapLibre requires an absolute local PMTiles file URI.");
  }
  if (!glyphsUrl.startsWith("file://")) throw new Error("Bundled glyph URL must use file://.");
  return {
    version: 8,
    glyphs: glyphsUrl,
    sources: {
      hcm: {
        type: "vector",
        url: pmtilesUri,
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
      {
        id: "place-labels", type: "symbol", source: "hcm", "source-layer": "places",
        minzoom: 10, filter: ["has", "name"],
        layout: {
          "text-field": ["coalesce", ["get", "name:vi"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 10, 11, 14, 14, 16, 16],
          "text-max-width": 9,
          "text-allow-overlap": false,
        },
        paint: { "text-color": "#56524e", "text-halo-color": "#ffffff", "text-halo-width": 2 },
      },
      {
        id: "road-labels", type: "symbol", source: "hcm", "source-layer": "roads",
        minzoom: 12, filter: ["has", "name"],
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 400,
          "text-field": ["coalesce", ["get", "name:vi"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 12, 10, 16, 12],
          "text-max-angle": 30,
          "text-keep-upright": true,
          "text-allow-overlap": false,
        },
        paint: { "text-color": "#656363", "text-halo-color": "#ffffff", "text-halo-width": 1.7 },
      },
      {
        id: "water-labels", type: "symbol", source: "hcm", "source-layer": "water",
        minzoom: 12, filter: ["has", "name"],
        layout: {
          "text-field": ["coalesce", ["get", "name:vi"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": 11,
          "text-max-width": 9,
          "text-allow-overlap": false,
        },
        paint: { "text-color": "#41849e", "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
      },
      {
        id: "landuse-labels", type: "symbol", source: "hcm", "source-layer": "landuse",
        minzoom: 14, filter: ["has", "name"],
        layout: {
          "text-field": ["coalesce", ["get", "name:vi"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": 11,
          "text-max-width": 9,
          "text-allow-overlap": false,
        },
        paint: { "text-color": "#437655", "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
      },
      {
        id: "poi-labels", type: "symbol", source: "hcm", "source-layer": "pois",
        minzoom: 15, filter: ["has", "name"],
        layout: {
          "text-field": ["coalesce", ["get", "name:vi"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": 10,
          "text-max-width": 9,
          "text-allow-overlap": false,
        },
        paint: { "text-color": "#685946", "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
      },
    ],
  };
}
