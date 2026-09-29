import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';

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
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/tabIcons/hero-banner.png')} 
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          
          {/* THANH TÌM KIẾM */}
          <View style={[
            styles.searchContainer, 
            { backgroundColor: theme.colors.surface || '#EAE4D3' } 
          ]}>
            <Image 
              source={require('@/assets/images/tabIcons/search.png')} 
              style={[styles.searchIconImage, { tintColor: theme.colors.textMuted }]} 
            />
            <TextInput 
              style={[styles.searchInput, { color: theme.colors.textPrimary }]}
              placeholder="Search point of interest..."
              placeholderTextColor={theme.colors.textMuted} 
            />
          </View>

          {/* TIÊU ĐỀ DANH SÁCH  */}
          <View style={styles.sectionHeader}>
            <ThemedText color="textPrimary" style={styles.sectionTitle}>
              Points of Interest near you
            </ThemedText>
            <ThemedText color="textSecondary" style={styles.sectionSubtitle}>
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
    height: 200, 
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE4D3', 
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
  },
  searchIconImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#666', 
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  listContainer: {
    gap: 15,
  },
});