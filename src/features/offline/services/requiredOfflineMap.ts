/** MapLibre owns the native tile database; this service owns pack identity and lifecycle. */
import { OfflineManager } from "@maplibre/maplibre-react-native";
import {
  REQUIRED_OFFLINE_MAP,
  requireOfflineMapStyleUrl,
} from "../constants/requiredMap";

type OfflinePack = Awaited<ReturnType<typeof OfflineManager.getPacks>>[number];
type PackStatus = Awaited<ReturnType<OfflinePack["status"]>>;

type ProgressListener = Parameters<typeof OfflineManager.createPack>[1];
type ErrorListener = Parameters<typeof OfflineManager.createPack>[2];

export type RequiredMapDownloadEvents = {
  onProgress: (progress: number, complete: boolean) => void;
  onError: (message: string) => void;
};

const boundsKey = REQUIRED_OFFLINE_MAP.bounds.join(",");

function packMatches(pack: OfflinePack, styleUrl: string): boolean {
  // Different providers, bounds or versions must not unlock an obsolete pack.
  const metadata: unknown = pack.metadata;
  if (!metadata || typeof metadata !== "object") return false;
  const fields = metadata as Record<string, unknown>;
  return (
    fields.regionKey === REQUIRED_OFFLINE_MAP.key &&
    fields.version === REQUIRED_OFFLINE_MAP.version &&
    fields.styleUrl === styleUrl &&
    fields.boundsKey === boundsKey
  );
}

export async function getRequiredOfflinePack(): Promise<OfflinePack | null> {
  const styleUrl = requireOfflineMapStyleUrl();
  const packs = await OfflineManager.getPacks();
  return packs.find((pack) => packMatches(pack, styleUrl)) ?? null;
}

export function isPackComplete(status: PackStatus): boolean {
  // A percentage of 100 can be temporary while the SDK is discovering resources.
  return status.state === "complete";
}

function progressPercent(status: PackStatus): number {
  const percentage = Number(status.percentage);
  return Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;
}

export async function startRequiredMapDownload(events: RequiredMapDownloadEvents): Promise<{
  id: string;
  status: PackStatus;
}> {
  const styleUrl = requireOfflineMapStyleUrl();
  const progressListener: ProgressListener = (_pack, status) => {
    events.onProgress(progressPercent(status), isPackComplete(status));
  };
  const errorListener: ErrorListener = (_pack, error) => {
    events.onError(error.message || "Không thể tải dữ liệu bản đồ.");
  };

  const existing = await getRequiredOfflinePack();
  if (existing) {
    await OfflineManager.addListener(existing.id, progressListener, errorListener);
    const status = await existing.status();
    if (!isPackComplete(status)) await existing.resume();
    return { id: existing.id, status };
  }

  const pack = await OfflineManager.createPack(
    {
      mapStyle: styleUrl,
      bounds: REQUIRED_OFFLINE_MAP.bounds,
      minZoom: REQUIRED_OFFLINE_MAP.minZoom,
      maxZoom: REQUIRED_OFFLINE_MAP.maxZoom,
      metadata: {
        regionKey: REQUIRED_OFFLINE_MAP.key,
        version: REQUIRED_OFFLINE_MAP.version,
        styleUrl,
        boundsKey,
      },
    },
    progressListener,
    errorListener,
  );
  const status = await pack.status();
  if (!isPackComplete(status)) await pack.resume();
  return { id: pack.id, status };
}

export function unsubscribeFromRequiredMap(id: string): void {
  OfflineManager.removeListener(id);
}
