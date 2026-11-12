/** Nạp POI khi Explore được focus hoặc tab Explore đang chọn được nhấn lại. */
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { poiApi } from "../services/poi.api";
import type { ExplorePoiListState } from "../types/explore.types";
import { toExplorePoi } from "../utils/poi-mapper";

const INITIAL_STATE: ExplorePoiListState = {
  pois: [],
  loading: true,
  error: null,
};

export function usePois() {
  const navigation = useNavigation();
  const [state, setState] = useState<ExplorePoiListState>(INITIAL_STATE);
  const requestRef = useRef<AbortController | null>(null);
  const isFocusedRef = useRef(false);

  const refresh = useCallback(() => {
    if (!isFocusedRef.current || requestRef.current !== null) {
      // Không gửi request trùng nếu tab không hiển thị hoặc đang tải dữ liệu.
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
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
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null;
        }
      }
    }

    void loadPois();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Lần đầu mở Explore hoặc quay lại từ tab khác đều tải dữ liệu mới.
      isFocusedRef.current = true;
      refresh();

      return () => {
        isFocusedRef.current = false;
        requestRef.current?.abort();
        requestRef.current = null;
      };
    }, [refresh]),
  );

  useEffect(() => {
    // Khi nhấn lại tab đang được chọn, focus không đổi nên phải bắt tabPress.
    const unsubscribe = navigation.addListener("tabPress", () => {
      if (navigation.isFocused()) {
        refresh();
      }
    });

    return unsubscribe;
  }, [navigation, refresh]);

  return { ...state, retry: refresh };
}
