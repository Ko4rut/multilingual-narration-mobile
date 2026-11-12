import { apiGet } from "@/lib/api-client";

export interface Poi {
  id: string;
  poi_name: string;
  poi_image_url: string;
  latitude: number;
  longitude: number;
  trigger_radius_meter: number;
}

interface PoiPage {
  items: Poi[];
  total: number;
  offset: number;
  limit: number;
}

export const poiApi = {
  getAll: () => apiGet<PoiPage>("/pois"),

  getById: (id: string) =>
    apiGet<Poi>(`/pois/${encodeURIComponent(id)}`),

  getNarration: (id: string, language = "vi") =>
    apiGet(
      `/pois/${encodeURIComponent(id)}/narration?language_code=${encodeURIComponent(language)}`
    ),
};