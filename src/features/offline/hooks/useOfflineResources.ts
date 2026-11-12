/**
 * Điều phối việc chuẩn bị dữ liệu bản đồ ngay khi ứng dụng khởi động.
 *
 * Đây là bước copy dữ liệu đã có trong APK, KHÔNG phải tải gói offline
 * từ Internet. Chỉ cho phép hiển thị MapLibre khi cả PMTiles và glyphs sẵn sàng.
 */
import { useEffect, useState } from "react";

import type { BundledMapResources } from "../context/BundledMapContext";
import { prepareBundledGlyphs } from "../services/bundledGlyphs";
import { prepareBundledMap } from "../services/bundledMap";

export type OfflineResourcePhase = "preparing" | "ready" | "error";

export interface OfflineResourceState {
  phase: OfflineResourcePhase;
  resources: BundledMapResources | null;
  errorMessage: string | null;
}

const INITIAL_STATE: OfflineResourceState = {
  phase: "preparing",
  resources: null,
  errorMessage: null,
};

function getErrorMessage(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message;
  }

  return String(cause);
}

export function useOfflineResources() {
  const [state, setState] = useState<OfflineResourceState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(function prepareOfflineResourcesEffect() {
    let active = true;

    async function initializeOfflineResources(): Promise<void> {
      setState(INITIAL_STATE);

      try {
        const [pmtilesUri, glyphsUrl] = await Promise.all([
          prepareBundledMap(),
          prepareBundledGlyphs(),
        ]);

        if (!active) {
          return;
        }

        setState({
          phase: "ready",
          resources: { pmtilesUri, glyphsUrl },
          errorMessage: null,
        });
      } catch (cause) {
        if (!active) {
          return;
        }

        setState({
          phase: "error",
          resources: null,
          errorMessage: getErrorMessage(cause),
        });
      }
    }

    void initializeOfflineResources();

    return function cleanupOfflineResourcesEffect() {
      // Hủy việc cập nhật state nếu màn hình đã unmount.
      // Promise dùng chung vẫn tiếp tục; retry sẽ sử dụng lại file đã chuẩn bị.
      active = false;
    };
  }, [attempt]);

  function retry(): void {
    setAttempt(function increaseAttempt(previousAttempt) {
      return previousAttempt + 1;
    });
  }

  return { ...state, retry };
}
