/** Blocks first-launch navigation until the fixed HCMC offline pack is truly complete. */
import { useCallback, useEffect, useState } from "react";
import {
  getRequiredOfflinePack,
  isPackComplete,
  startRequiredMapDownload,
  unsubscribeFromRequiredMap,
} from "../services/requiredOfflineMap";

export type RequiredMapPhase = "checking" | "downloading" | "ready" | "error";

export type RequiredMapState = {
  phase: RequiredMapPhase;
  progress: number;
  error: string | null;
};

export function useRequiredOfflineMap() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RequiredMapState>({
    phase: "checking",
    progress: 0,
    error: null,
  });

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  useEffect(() => {
    let disposed = false;
    let listenerPackId: string | null = null;
    setState({ phase: "checking", progress: 0, error: null });

    async function prepareMap() {
      try {
        const existing = await getRequiredOfflinePack();
        const status = existing ? await existing.status() : null;
        if (disposed) return;
        if (status && isPackComplete(status)) {
          setState({ phase: "ready", progress: 100, error: null });
          return;
        }

        setState({
          phase: "downloading",
          progress: status ? Math.min(99, status.percentage ?? 0) : 0,
          error: null,
        });

        const result = await startRequiredMapDownload({
          onProgress: (progress, complete) => {
            if (disposed) return;
            setState((previous) => {
              if (previous.phase === "error" || previous.phase === "ready") return previous;
              return {
                phase: complete ? "ready" : "downloading",
                progress: complete ? 100 : Math.min(99, progress),
                error: null,
              };
            });
          },
          onError: (message) => {
            if (!disposed) {
              setState((previous) => ({ ...previous, phase: "error", error: message }));
            }
          },
        });
        listenerPackId = result.id;
        if (disposed) {
          unsubscribeFromRequiredMap(result.id);
          return;
        }
        setState((previous) => {
          if (previous.phase === "error" || previous.phase === "ready") return previous;
          const complete = isPackComplete(result.status);
          return {
            phase: complete ? "ready" : "downloading",
            progress: complete ? 100 : Math.min(99, result.status.percentage ?? 0),
            error: null,
          };
        });
      } catch (cause) {
        if (!disposed) {
          setState((previous) => ({
            ...previous,
            phase: "error",
            error: cause instanceof Error ? cause.message : String(cause),
          }));
        }
      }
    }

    void prepareMap();
    return () => {
      disposed = true;
      if (listenerPackId) unsubscribeFromRequiredMap(listenerPackId);
    };
  }, [attempt]);

  return { ...state, retry };
}
