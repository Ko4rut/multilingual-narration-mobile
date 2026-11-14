/**
 * Contract của API QR Resolve và dữ liệu audio được dùng trong module QR Scan.
 * Tên field giữ nguyên snake_case vì đây là dữ liệu backend trả về.
 */

export interface QrResolveRequest {
  qr_code: string;
  language_code: string;
}

export interface QrPoi {
  id: string;
  region_id: string;
  poi_name: string;
  poi_image_url: string;
  image_checksum_sha256: string | null;
  poi_qr_code: string;
  poi_location: string;
  poi_status: "ACTIVE" | "INACTIVE";
  latitude: string;
  longitude: string;
  trigger_radius_meter: string;
  created_at: string;
  last_updated_at: string;
}

export interface QrAudioAsset {
  id: string;
  poi_content_id: string;
  audio_url: string;
  audio_size: number;
  audio_source_type: "RECORD" | "TTS";
  audio_duration_sec: number;
  audio_mime_type: string;
  audio_checksum_sha256: string;
  created_at: string;
  last_updated_at: string;
}

export interface QrPublishedNarration {
  poi_id: string;
  content_id: string;
  language_code: string;
  requested_language_code: string;
  is_fallback: boolean;
  narration_title: string;
  narration_script: string;
  content_version: number;
  audio: QrAudioAsset;
}

export interface QrResolveResponse {
  poi: QrPoi;
  narration: QrPublishedNarration;
}

/**
 * Dữ liệu UI cần sau khi nhận kết quả.
 * Tách khỏi API DTO để component không phụ thuộc trực tiếp vào snake_case.
 */
export interface ResolvedQrAudio {
  qrCode: string;
  poiId: string;
  poiName: string;
  contentId: string;
  narrationTitle: string;
  languageCode: string;
  requestedLanguageCode: string;
  isFallback: boolean;
  audioUrl: string;
  durationSeconds: number;
  audioSourceType: "RECORD" | "TTS";
}

export type QrResolveStatus = "idle" | "loading" | "success" | "error";
