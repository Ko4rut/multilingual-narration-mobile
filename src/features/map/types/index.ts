/** Các kiểu tọa độ, map props và POI được chia sẻ trong feature Map. */
import type { CameraRef } from "@maplibre/maplibre-react-native";

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapProps = {
  latitude?: number;
  longitude?: number;
  cameraRef: React.RefObject<CameraRef | null>;

  onSelect?: (latitude: number, longitude: number) => void;
};

export type UserLocationMarkerProps = MapCoordinate;

export type PointOfInterest = MapCoordinate & {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  distanceMeters: number;
  categories: string[];
};
