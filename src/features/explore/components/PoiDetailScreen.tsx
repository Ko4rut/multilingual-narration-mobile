import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_POIS } from '../data/mock-pois';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function PoiDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const poi = MOCK_POIS.find((p) => p.id === id);

  if (!poi) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText color="textPrimary" style={{ fontSize: 18 }}>Không tìm thấy địa điểm!</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#6B8E23', fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const formattedDistance = poi.distanceMeters >= 1000 
    ? `${(poi.distanceMeters / 1000).toFixed(1)}km` 
    : `${poi.distanceMeters}m`;

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ẢNH BÌA & NÚT BACK */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: poi.imageUrl }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.backButtonContainer} activeOpacity={0.7} onPress={() => router.back()}>
            <Image 
              source={require('@/assets/images/tabIcons/circle-back.png')} 
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {/* TIÊU ĐỀ & KHOẢNG CÁCH */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <ThemedText color="textPrimary" style={styles.title}>{poi.name}</ThemedText>
              <ThemedText color="textSecondary" style={styles.address} numberOfLines={1}>
                {poi.categories.join(' • ')}
              </ThemedText>
            </View>
            
            <View style={styles.distanceBadge}>
              <Image 
                source={require('@/assets/images/tabIcons/map-pin.png')} 
                style={styles.locationIcon} 
              />
              <Text style={styles.distanceText}>{formattedDistance}</Text>
            </View>
          </View>

          {/* TRÌNH PHÁT AUDIO */}
          <View style={[
            styles.audioPlayerCard, 
            { backgroundColor: theme.colors.surface || '#EAE4D3' }
          ]}>
            <View style={styles.audioHeader}>
              <View style={styles.audioInfo}>
                <ThemedText color="textPrimary" style={styles.audioTitle}>
                  {poi.name} - Narration - EN
                </ThemedText>
                <ThemedText color="textMuted" style={styles.audioSubtitle}>
                  Narrated by System
                </ThemedText>
              </View>
              
              <TouchableOpacity activeOpacity={0.8}>
                <Image 
                  source={require('@/assets/images/tabIcons/player-actions.png')} 
                  style={styles.playButtonImage}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <View style={[
                styles.progressBarBackground, 
                { backgroundColor: theme.colors.border || '#D1CDBF' }
              ]}>
                <View style={styles.progressBarFill} /> 
              </View>
              <View style={styles.timeRow}>
                <ThemedText color="textMuted" style={styles.timeText}>0:00</ThemedText>
                <ThemedText color="textMuted" style={styles.timeText}>2:15</ThemedText>
              </View>
            </View>
          </View>

          {/* NỘI DUNG THUYẾT MINH */}
          <View style={styles.scriptSection}>
            <ThemedText color="textPrimary" style={styles.scriptTitle}>Historic Narration Script</ThemedText>
            <ThemedText color="textSecondary" style={styles.scriptParagraph}>{poi.description}</ThemedText>
            <ThemedText color="textSecondary" style={styles.scriptParagraph}>
              Welcome to {poi.name}. As you explore this {poi.categories[0]?.toLowerCase() || 'landmark'}, you will discover its unique history and significance to the city. Narration is automatically triggered when you enter the virtual geofence.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60, 
    left: 10,
  },
  backButtonImage: {
    width: 70, 
    height: 70, 
    resizeMode: 'contain',
  },
  
  playButtonImage: {
    width: 70,  
    height: 70, 
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    // Đã xóa color
  },
  address: {
    fontSize: 14,
    // Đã xóa color
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE4D3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: '#6B8E23',
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: 'bold',
  },
  audioPlayerCard: {
    backgroundColor: '#EAE4D3', 
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioInfo: {
    flex: 1,
    paddingRight: 15,
  },
  audioTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  audioSubtitle: {
    fontSize: 13,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#D1CDBF',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarFill: {
    width: '30%', 
    height: '100%',
    backgroundColor: '#6B8E23',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  scriptSection: {
    marginTop: 10,
  },
  scriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scriptParagraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 15,
  },
});