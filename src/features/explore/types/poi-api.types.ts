/** Contract công khai của Backend FastAPI /api/v1/pois. */
export type PoiApiResponse = {
  id: string;
  region_id: string;
  poi_name: string;
  poi_image_url: string;
  image_checksum_sha256: string | null;
  poi_qr_code: string;
  poi_location: string;
  poi_status: string;
  // Pydantic Decimal có thể được JSON serialize thành chuỗi.
  latitude: string | number;
  longitude: string | number;
  trigger_radius_meter: string | number;
  created_at: string;
  last_updated_at: string;
};

export type PoiPageApiResponse = {
  items: PoiApiResponse[];
  total: number;
  offset: number;
  limit: number;
};

export type NarrationAudioApiResponse = {
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
};

export type NarrationApiResponse = {
  poi_id: string;
  content_id: string;
  language_code: string;
  requested_language_code: string;
  is_fallback: boolean;
  narration_title: string;
  narration_script: string;
  content_version: number;
  audio: NarrationAudioApiResponse;
};
