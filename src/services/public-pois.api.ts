/** API public dùng chung cho Explore và Map. */
import { getApiBaseUrl, normalizeBackendAssetUrl } from "./api-base-url";

export type PublicPoi = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  categories: string[];
  distanceMeters: number | null;
  qrCode: string;
};

export type PublicPoiNarration = {
  contentId: string;
  title: string;
  script: string;
  languageCode: string;
  requestedLanguageCode: string;
  isFallback: boolean;
  audioUrl: string;
  durationSeconds: number;
};

type PublicPoiPage = {
  items: PublicPoi[];
  total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapPoi(rawPoi: unknown, apiBaseUrl: string): PublicPoi {
  if (!isRecord(rawPoi)) {
    throw new Error("The POI response is invalid.");
  }

  if (
    typeof rawPoi.id !== "string" ||
    typeof rawPoi.poi_name !== "string" ||
    typeof rawPoi.poi_location !== "string" ||
    typeof rawPoi.poi_image_url !== "string" ||
    typeof rawPoi.poi_qr_code !== "string"
  ) {
    throw new Error("The POI response is missing required fields.");
  }

  const latitude = Number(rawPoi.latitude);
  const longitude = Number(rawPoi.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("The POI response contains invalid coordinates.");
  }

  return {
    id: rawPoi.id,
    name: rawPoi.poi_name,
    description: rawPoi.poi_location,
    imageUrl: normalizeBackendAssetUrl(rawPoi.poi_image_url, apiBaseUrl),
    latitude,
    longitude,
    categories: ["Point of Interest"],
    distanceMeters: null,
    qrCode: rawPoi.poi_qr_code,
  };
}

function mapNarration(
  rawNarration: unknown,
  apiBaseUrl: string,
): PublicPoiNarration {
  if (!isRecord(rawNarration) || !isRecord(rawNarration.audio)) {
    throw new Error("The published narration response is invalid.");
  }

  const audio = rawNarration.audio;

  if (
    typeof rawNarration.content_id !== "string" ||
    typeof rawNarration.narration_title !== "string" ||
    typeof rawNarration.narration_script !== "string" ||
    typeof rawNarration.language_code !== "string" ||
    typeof rawNarration.requested_language_code !== "string" ||
    typeof rawNarration.is_fallback !== "boolean" ||
    typeof audio.audio_url !== "string" ||
    typeof audio.audio_duration_sec !== "number"
  ) {
    throw new Error("The published narration response is missing required fields.");
  }

  return {
    contentId: rawNarration.content_id,
    title: rawNarration.narration_title,
    script: rawNarration.narration_script,
    languageCode: rawNarration.language_code,
    requestedLanguageCode: rawNarration.requested_language_code,
    isFallback: rawNarration.is_fallback,
    audioUrl: normalizeBackendAssetUrl(audio.audio_url, apiBaseUrl),
    durationSeconds: audio.audio_duration_sec,
  };
}

async function requireOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(`Unable to load points of interest (HTTP ${response.status}).`);
  }
}

export async function getPublicPois(signal?: AbortSignal): Promise<PublicPoiPage> {
  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(apiBaseUrl + "/api/v1/pois?offset=0&limit=100", {
    signal,
  });
  await requireOk(response);

  const body: unknown = await response.json();

  if (!isRecord(body) || !Array.isArray(body.items) || typeof body.total !== "number") {
    throw new Error("The POI list response is invalid.");
  }

  return {
    items: body.items.map((item) => mapPoi(item, apiBaseUrl)),
    total: body.total,
  };
}

export async function getPublicPoi(
  poiId: string,
  signal?: AbortSignal,
): Promise<PublicPoi> {
  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(
    apiBaseUrl + "/api/v1/pois/" + encodeURIComponent(poiId),
    { signal },
  );
  await requireOk(response);
  return mapPoi(await response.json(), apiBaseUrl);
}

export async function getPublicPoiNarration(
  poiId: string,
  languageCode: string,
  signal?: AbortSignal,
): Promise<PublicPoiNarration> {
  const apiBaseUrl = await getApiBaseUrl();
  const query = new URLSearchParams({ language_code: languageCode });
  const response = await fetch(
    apiBaseUrl +
      "/api/v1/pois/" +
      encodeURIComponent(poiId) +
      "/narration?" +
      query.toString(),
    { signal },
  );
  await requireOk(response);
  return mapNarration(await response.json(), apiBaseUrl);
}
