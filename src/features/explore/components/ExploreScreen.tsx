import { useRouter } from 'expo-router';
import { Image, ImageBackground, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { MOCK_POIS } from '../data/mock-pois';
import { PoiCard } from './PoiCard';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* PHẦN HEADER */}
        <ImageBackground 
          source={require('@/assets/images/banner-image.png')} 
          style={styles.headerContainer}
          resizeMode="cover"
        >
          <View style={styles.bannerContent}>
            <ThemedText 
              color="textPrimary" 
              style={[theme.typography.heroTitle, styles.bannerTitle]}
            >
              Multilingual{'\n'}
              Automatic{'\n'}
              Narration System
            </ThemedText>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          
          {/* THANH TÌM KIẾM */}
          <View style={[
            styles.searchContainer, 
            { backgroundColor: theme.colors.surface }
          ]}>
            <Image 
              source={require('@/assets/images/tabIcons/search.png')} 
              style={[styles.searchIconImage, { tintColor: theme.colors.textMuted }]} 
            />
            <TextInput 
              style={[styles.searchInput, theme.typography.body, { color: theme.colors.textPrimary }]} 
              placeholder="Search point of interest..."
              placeholderTextColor={theme.colors.textMuted} 
            />
          </View>

          {/* TIÊU ĐỀ DANH SÁCH */}
          <View style={styles.sectionHeader}>
            <ThemedText 
              color="textPrimary" 
              style={[theme.typography.heading, { marginBottom: theme.spacing.xs }]}
            >
              Points of Interest near you
            </ThemedText>
            <ThemedText color="textSecondary" style={theme.typography.subtitle}>
              Narrations trigger automatically as you walk
            </ThemedText>
          </View>

          {/* DANH SÁCH CÁC POI */}
          <View style={styles.listContainer}>
            {MOCK_POIS.map((poi) => (
              <PoiCard 
                key={poi.id} 
                poi={poi} 
                onPress={(selectedPoi) => {
                  router.push({
                    pathname: "/poi/[id]",
                    params: { id: selectedPoi.id }
                  });
                }}
              />
            ))}
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
  headerContainer: {
    height: 240, 
    width: '100%',
  },
  bannerContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', 
  },
  bannerTitle: {
    marginTop: 50,
    letterSpacing: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
  },
  searchIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  listContainer: {
    gap: 15,
  },
});