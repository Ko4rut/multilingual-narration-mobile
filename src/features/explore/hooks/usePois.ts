/** Nạp danh sách POI từ backend, hỗ trợ retry và hủy request khi unmount. */
import { useEffect, useState } from "react";

import { poiApi } from "../services/poi.api";
import type { ExplorePoiListState } from "../types/explore.types";
import { toExplorePoi } from "../utils/poi-mapper";

const INITIAL_STATE: ExplorePoiListState = {
  pois: [],
  loading: true,
  error: null,
};

export function usePois() {
  const [state, setState] = useState<ExplorePoiListState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: null }));

    async function loadPois(): Promise<void> {
      try {
        const items = await poiApi.getAll(controller.signal);
        if (!controller.signal.aborted) {
          setState({ pois: items.map(toExplorePoi), loading: false, error: null });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            pois: [],
            loading: false,
            error: error instanceof Error ? error.message : "Không thể tải địa điểm.",
          });
        }
      }
    }

    void loadPois();
    return () => controller.abort();
  }, [attempt]);

  return { ...state, retry: () => setAttempt((current) => current + 1) };
}
