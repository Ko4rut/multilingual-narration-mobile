/** Kiểu dữ liệu POI được chia sẻ bởi danh sách và màn hình chi tiết Explore. */
export type ExplorePointOfInterest = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  distanceMeters: number;
  categories: string[];
  latitude: number;
  longitude: number;
};
