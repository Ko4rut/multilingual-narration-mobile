/** Chuyển contract Backend sang model UI, không bịa category, khoảng cách hoặc narration. */
import type { ExplorePointOfInterest } from "../types/explore.types";
import type { PoiApiResponse } from "../types/poi-api.types";

export function toExplorePoi(poi: PoiApiResponse): ExplorePointOfInterest {
  return {
    id: poi.id,
    name: poi.poi_name,
    description: poi.poi_location,
    imageUrl: poi.poi_image_url,
    distanceMeters: null,
    categories: [],
    latitude: Number(poi.latitude),
    longitude: Number(poi.longitude),
  };
}
