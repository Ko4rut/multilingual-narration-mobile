export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type LeafletMapProps = {
  latitude?: number;
  longitude?: number;
  onSelect?: (latitude: number, longitude: number) => void;
};
