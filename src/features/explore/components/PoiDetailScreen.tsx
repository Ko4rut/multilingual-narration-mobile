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
        <ThemedText color="textPrimary" style={theme.typography.heading}>Không tìm thấy địa điểm!</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.primaryDark }]}>Quay lại</Text>
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
              <ThemedText color="textPrimary" style={[theme.typography.heading, styles.title]}>
                {poi.name}
              </ThemedText>
              <ThemedText color="textSecondary" style={theme.typography.supporting} numberOfLines={1}>
                {poi.categories.join(' • ')}
              </ThemedText>
            </View>
            
            <View style={[styles.distanceBadge, { backgroundColor: theme.colors.surface }]}>
              <Image 
                source={require('@/assets/images/tabIcons/map-pin.png')} 
                style={[styles.locationIcon, { tintColor: theme.colors.primaryDark }]} 
              />
              <Text style={[theme.typography.label, { color: theme.colors.primaryDark }]}>
                {formattedDistance}
              </Text>
            </View>
          </View>

          {/* TRÌNH PHÁT AUDIO */}
          <View style={[
            styles.audioPlayerCard, 
            { backgroundColor: theme.colors.surface }
          ]}>
            <View style={styles.audioHeader}>
              <View style={styles.audioInfo}>
                <ThemedText color="textPrimary" style={[theme.typography.sectionTitle, styles.audioTitle]}>
                  {poi.name} - Narration - EN
                </ThemedText>
                <ThemedText color="textMuted" style={theme.typography.caption}>
                  Narrated by System
                </ThemedText>
              </View>
              
              {/* NÚT PLAY  */}
              <TouchableOpacity activeOpacity={0.8} style={styles.playButtonCircle}>
                <View style={styles.playTriangle} />
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <View style={[
                styles.progressBarBackground, 
                { backgroundColor: theme.colors.border }
              ]}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primaryDark }]} /> 
              </View>
              <View style={styles.timeRow}>
                <ThemedText color="textMuted" style={theme.typography.caption}>0:00</ThemedText>
                <ThemedText color="textMuted" style={theme.typography.caption}>2:15</ThemedText>
              </View>
            </View>
          </View>

          {/* NỘI DUNG THUYẾT MINH */}
          <View style={styles.scriptSection}>
            <ThemedText color="textPrimary" style={[theme.typography.sectionTitle, styles.scriptTitle]}>
              Historic Narration Script
            </ThemedText>
            <ThemedText color="textSecondary" style={[theme.typography.body, styles.scriptParagraph]}>
              {poi.description}
            </ThemedText>
            <ThemedText color="textSecondary" style={[theme.typography.body, styles.scriptParagraph]}>
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
  
  playButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, 
    backgroundColor: '#879A73', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, 
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF',
    marginLeft: 4, 
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
    marginBottom: 6,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  audioPlayerCard: {
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
    marginBottom: 4,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarFill: {
    width: '30%', 
    height: '100%',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scriptSection: {
    marginTop: 10,
  },
  scriptTitle: {
    marginBottom: 15,
    fontSize: 20, 
  },
  scriptParagraph: {
    marginBottom: 15,
  },
});