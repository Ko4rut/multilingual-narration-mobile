/**
 * Gọi API công khai để tìm POI và audio đã publish từ mã QR.
 * Service chỉ xử lý network và chuyển DTO; không giữ React state hay mở player.
 */
import type {
  QrResolveRequest,
  ResolvedQrAudio,
} from "../types/qr-scan.types";

/** Kiểm tra JSON object trước khi đọc field từ response chưa tin cậy. */
function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object") {
    return false;
  }

  if (value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return true;
}

/**
 * Địa chỉ backend phải đến từ môi trường chạy Mobile.
 * Không được dùng localhost khi điện thoại thật kết nối tới backend trên PC.
 */
function getApiBaseUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (typeof configuredUrl !== "string") {
    throw new Error("Chưa cấu hình EXPO_PUBLIC_API_BASE_URL cho Mobile.");
  }

  if (configuredUrl.trim().length === 0) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL đang trống.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(configuredUrl.trim());
  } catch (cause) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL không phải URL hợp lệ.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("API Base URL phải dùng HTTP hoặc HTTPS.");
  }

  // Chỉ dùng origin; service tự nối path /api/v1, tránh lặp đường dẫn.
  return parsedUrl.origin;
}

/** Trích lỗi backend thành thông báo dễ hiểu, không coi mọi lỗi là lỗi QR. */
async function getRequestError(response: Response): Promise<Error> {
  let serverDetail = "";

  try {
    const rawBody: unknown = await response.json();

    if (isRecord(rawBody)) {
      if (typeof rawBody.detail === "string") {
        serverDetail = rawBody.detail;
      }
    }
  } catch (cause) {
    // Backend hoặc proxy có thể trả HTML/text khi lỗi; vẫn giữ mã HTTP.
    serverDetail = "";
  }

  if (response.status === 404) {
    return new Error("Không tìm thấy POI đang hoạt động hoặc audio đã xuất bản.");
  } else if (response.status === 422) {
    return new Error("Mã QR không hợp lệ: " + serverDetail);
  } else if (response.status >= 500) {
    return new Error("Máy chủ đang gặp lỗi. Vui lòng thử lại.");
  } else {
    return new Error("Resolve QR thất bại (HTTP " + response.status + "): " + serverDetail);
  }
}

/**
 * Backend dev có thể lưu audio_url ở localhost:8000.
 * Khi Mobile gọi API qua IP LAN, đổi riêng host local của audio sang host API.
 * Không sửa URL HTTPS/CDN thật của production.
 */
function normalizeAudioUrl(rawAudioUrl: string, apiBaseUrl: string): string {
  let audioUrl: URL;
  let apiUrl: URL;

  try {
    audioUrl = new URL(rawAudioUrl);
    apiUrl = new URL(apiBaseUrl);
  } catch (cause) {
    throw new Error("Backend trả về audio_url không hợp lệ.");
  }

  if (audioUrl.protocol !== "http:" && audioUrl.protocol !== "https:") {
    throw new Error("audio_url phải sử dụng HTTP hoặc HTTPS.");
  }

  if (audioUrl.hostname === "localhost" || audioUrl.hostname === "127.0.0.1") {
    if (apiUrl.hostname !== "localhost" && apiUrl.hostname !== "127.0.0.1") {
      audioUrl.protocol = apiUrl.protocol;
      audioUrl.host = apiUrl.host;
    }
  }

  return audioUrl.toString();
}

/** Kiểm tra các field thực sự dùng cho việc xác định audio trước khi đưa cho UI. */
function mapResolvedAudio(
  rawResponse: unknown,
  scannedQrCode: string,
  apiBaseUrl: string,
): ResolvedQrAudio {
  if (!isRecord(rawResponse)) {
    throw new Error("Response QR không phải JSON object.");
  }

  if (!isRecord(rawResponse.poi)) {
    throw new Error("Response QR thiếu thông tin POI.");
  }

  if (!isRecord(rawResponse.narration)) {
    throw new Error("Response QR thiếu nội dung thuyết minh.");
  }

  if (!isRecord(rawResponse.narration.audio)) {
    throw new Error("Response QR thiếu audio đã xuất bản.");
  }

  const poi = rawResponse.poi;
  const narration = rawResponse.narration;
  const audio = narration.audio;

  if (typeof poi.id !== "string" || typeof poi.poi_name !== "string") {
    throw new Error("Thông tin POI từ backend không hợp lệ.");
  }

  if (poi.poi_status !== "ACTIVE") {
    throw new Error("POI này hiện không hoạt động.");
  }

  if (typeof narration.content_id !== "string" ||
      typeof narration.narration_title !== "string" ||
      typeof narration.language_code !== "string" ||
      typeof narration.requested_language_code !== "string" ||
      typeof narration.is_fallback !== "boolean") {
    throw new Error("Thông tin thuyết minh từ backend không hợp lệ.");
  }

  if (typeof audio.audio_url !== "string" ||
      typeof audio.audio_duration_sec !== "number") {
    throw new Error("Thông tin file âm thanh từ backend không hợp lệ.");
  }

  if (!Number.isFinite(audio.audio_duration_sec) || audio.audio_duration_sec < 0) {
    throw new Error("Thời lượng âm thanh từ backend không hợp lệ.");
  }

  if (audio.audio_source_type !== "TTS" && audio.audio_source_type !== "RECORD") {
    throw new Error("Nguồn âm thanh từ backend không được hỗ trợ.");
  }

  // Sử dụng trực tiếp các field đã kiểm tra ở trên, không ép kiểu JSON mù.
  const normalizedAudioUrl = normalizeAudioUrl(audio.audio_url, apiBaseUrl);

  return {
    qrCode: scannedQrCode,
    poiId: poi.id,
    poiName: poi.poi_name,
    contentId: narration.content_id,
    narrationTitle: narration.narration_title,
    languageCode: narration.language_code,
    requestedLanguageCode: narration.requested_language_code,
    isFallback: narration.is_fallback,
    audioUrl: normalizedAudioUrl,
    durationSeconds: audio.audio_duration_sec,
    audioSourceType: audio.audio_source_type,
  };
}

/**
 * Một request trả về audio hợp lệ cho mã QR vừa quét.
 * AbortSignal cho phép hook hủy request khi người dùng rời màn hình/quét lại.
 */
export async function resolveQrAudio(
  payload: QrResolveRequest,
  signal: AbortSignal,
): Promise<ResolvedQrAudio> {
  const qrCode = payload.qr_code.trim();
  const languageCode = payload.language_code.trim().toLowerCase();

  if (qrCode.length === 0) {
    throw new Error("Camera chưa nhận được nội dung mã QR.");
  }

  if (!/^[a-z]{2,3}$/.test(languageCode)) {
    throw new Error("Mã ngôn ngữ phải gồm 2 hoặc 3 chữ cái, ví dụ vi hoặc en.");
  }

  const apiBaseUrl = getApiBaseUrl();
  const requestBody: QrResolveRequest = {
    qr_code: qrCode,
    language_code: languageCode,
  };

  const response = await fetch(apiBaseUrl + "/api/v1/pois/qr/resolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    signal: signal,
  });

  if (!response.ok) {
    throw await getRequestError(response);
  }

  const rawResponse: unknown = await response.json();
  return mapResolvedAudio(rawResponse, qrCode, apiBaseUrl);
}
