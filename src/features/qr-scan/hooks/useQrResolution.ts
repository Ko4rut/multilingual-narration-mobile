/**
 * Điều phối vòng đời request QR Resolve và trạng thái kết quả.
 * Hook này không biết camera hoặc cách trình bày UI.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { resolveQrAudio } from "../services/qr-scan.api";
import type {
  QrResolveStatus,
  ResolvedQrAudio,
} from "../types/qr-scan.types";

export function useQrResolution() {
  const [status, setStatus] = useState<QrResolveStatus>("idle");
  const [resolvedAudio, setResolvedAudio] = useState<ResolvedQrAudio | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentRequestRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(true);

  useEffect(function manageRequestLifecycle() {
    mountedRef.current = true;

    return function cancelRequestOnUnmount() {
      mountedRef.current = false;

      // Không giữ request chạy ngầm sau khi màn hình đã đóng.
      if (currentRequestRef.current !== null) {
        currentRequestRef.current.abort();
        currentRequestRef.current = null;
      }
    };
  }, []);

  const resolveScannedQr = useCallback(async function resolveScannedQr(
    qrCode: string,
    languageCode: string,
  ): Promise<void> {
    // Camera có thể gọi callback nhiều lần trước lần render tiếp theo.
    // Dùng ref để chỉ có duy nhất một request đang chạy.
    if (currentRequestRef.current !== null) {
      return;
    }

    const controller = new AbortController();
    currentRequestRef.current = controller;
    setStatus("loading");
    setResolvedAudio(null);
    setErrorMessage(null);

    try {
      const audio = await resolveQrAudio(
        {
          qr_code: qrCode,
          language_code: languageCode,
        },
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      if (!mountedRef.current) {
        return;
      }

      setResolvedAudio(audio);
      setStatus("success");
    } catch (cause) {
      if (controller.signal.aborted) {
        return;
      }

      if (!mountedRef.current) {
        return;
      }

      if (cause instanceof Error) {
        setErrorMessage(cause.message);
      } else {
        setErrorMessage("Không thể tìm audio từ mã QR. Vui lòng thử lại.");
      }

      setStatus("error");
    } finally {
      if (currentRequestRef.current === controller) {
        currentRequestRef.current = null;
      }
    }
  }, []);

  const resetResolution = useCallback(function resetResolution(): void {
    // Khi chọn quét mã khác, hủy response cũ để không ghi đè màn hình mới.
    if (currentRequestRef.current !== null) {
      currentRequestRef.current.abort();
      currentRequestRef.current = null;
    }

    setResolvedAudio(null);
    setErrorMessage(null);
    setStatus("idle");
  }, []);

  return {
    status,
    resolvedAudio,
    errorMessage,
    resolveScannedQr,
    resetResolution,
  };
}
