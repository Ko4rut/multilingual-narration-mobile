/** Route động cho chi tiết POI; chỉ đọc params và ghép feature screen. */
import { useLocalSearchParams, useRouter } from "expo-router";

import PoiDetailScreen from "@/features/explore/components/PoiDetailScreen";

export default function PoiDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return <PoiDetailScreen onBack={() => router.back()} poiId={id} />;
}
