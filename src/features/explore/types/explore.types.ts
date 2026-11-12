/** Kiểu dữ liệu UI và trạng thái tải cho Explore. */
import type { NarrationApiResponse } from "./poi-api.types";

export type ExplorePointOfInterest = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  // Không hiển thị khoảng cách giả khi chưa lấy vị trí thiết bị.
  distanceMeters: number | null;
  categories: string[];
  latitude: number;
  longitude: number;
};

export type ExplorePoiListState = {
  pois: ExplorePointOfInterest[];
  loading: boolean;
  error: string | null;
};

export type ExplorePoiDetailState = {
  poi: ExplorePointOfInterest | null;
  narration: NarrationApiResponse | null;
  loading: boolean;
  error: string | null;
  narrationError: string | null;
};

export type PoiDetailScreenProps = {
  poiId: string;
  onBack(): void;
};

export type PoiCardProps = {
  poi: ExplorePointOfInterest;
  onPress?(poi: ExplorePointOfInterest): void;
};

export type PoiNarrationPlayerProps = {
  poiName: string;
  narration: NarrationApiResponse | null;
};
