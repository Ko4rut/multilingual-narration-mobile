/** Nạp POI và nội dung narration; narration 404 không làm mất thông tin POI. */
import { useEffect, useState } from "react";

import { ApiHttpError } from "@/lib/api-client";
import { poiApi } from "../services/poi.api";
import type { ExplorePoiDetailState } from "../types/explore.types";
import { toExplorePoi } from "../utils/poi-mapper";

const INITIAL_STATE: ExplorePoiDetailState = {
  poi: null,
  narration: null,
  loading: true,
  error: null,
  narrationError: null,
};

export function usePoiDetail(poiId: string, languageCode = "en") {
  const [state, setState] = useState<ExplorePoiDetailState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ ...INITIAL_STATE });

    async function loadDetail(): Promise<void> {
      try {
        if (!poiId) throw new Error("Thiếu mã địa điểm.");
        const poi = toExplorePoi(await poiApi.getById(poiId, controller.signal));
        let narration: ExplorePoiDetailState["narration"] = null;
        let narrationError: string | null = null;

        try {
          narration = await poiApi.getNarration(poiId, languageCode, controller.signal);
        } catch (error) {
          if (controller.signal.aborted) return;
          if (!(error instanceof ApiHttpError && error.status === 404)) {
            narrationError =
              error instanceof Error ? error.message : "Không thể tải nội dung thuyết minh.";
          }
        }

        if (!controller.signal.aborted) {
          setState({ poi, narration, narrationError, error: null, loading: false });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            ...INITIAL_STATE,
            loading: false,
            error: error instanceof Error ? error.message : "Không thể tải địa điểm.",
          });
        }
      }
    }

    void loadDetail();
    return () => controller.abort();
  }, [poiId, languageCode, attempt]);

  return { ...state, retry: () => setAttempt((current) => current + 1) };
}
