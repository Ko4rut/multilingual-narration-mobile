/** Chỉ thực hiện I/O HTTP cho các endpoint public POI và narration. */
import { apiGet } from "@/lib/api-client";
import type {
  NarrationApiResponse,
  PoiApiResponse,
  PoiPageApiResponse,
} from "../types/poi-api.types";

const PAGE_SIZE = 100;

export const poiApi = {
  async getAll(signal?: AbortSignal): Promise<PoiApiResponse[]> {
    const pois: PoiApiResponse[] = [];
    let offset = 0;

    // Backend giới hạn limit <= 100, cần tải nhiều trang để không sót POI.
    while (true) {
      const page = await apiGet<PoiPageApiResponse>(
        `/pois?offset=${offset}&limit=${PAGE_SIZE}`,
        { signal },
      );
      if (page.items.length === 0) {
        if (offset < page.total) {
          throw new Error("API POI trả về trang rỗng trước khi hết dữ liệu.");
        }
        return pois;
      }

      pois.push(...page.items);
      offset += page.items.length;
      if (offset >= page.total) return pois;
    }
  },

  getById(id: string, signal?: AbortSignal): Promise<PoiApiResponse> {
    return apiGet<PoiApiResponse>(`/pois/${encodeURIComponent(id)}`, { signal });
  },

  getNarration(
    id: string,
    languageCode = "en",
    signal?: AbortSignal,
  ): Promise<NarrationApiResponse> {
    return apiGet<NarrationApiResponse>(
      `/pois/${encodeURIComponent(id)}/narration?language_code=${encodeURIComponent(languageCode)}`,
      { signal },
    );
  },
};
