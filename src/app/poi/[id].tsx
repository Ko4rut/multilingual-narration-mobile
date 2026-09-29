import PoiDetailScreen from '@/features/explore/components/PoiDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function PoiDetailRoute() {
  const { id } = useLocalSearchParams(); 

  return <PoiDetailScreen />;
}