/** Màn hình chi tiết POI, nhận điều hướng từ route và render dữ liệu feature. */
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NarrationAudioPlayer } from "@/features/audio/components/NarrationAudioPlayer";
import { QrAudioPlayer } from "@/features/qr-scan/components/QrAudioPlayer";
import { useLanguagePreference } from "@/features/settings/context/LanguagePreferenceContext";
import { useTheme } from "@/hooks/use-theme";
import {
  usePublicPoi,
  usePublicPoiNarration,
} from "@/hooks/use-public-pois";
import { formatDistance } from "@/utils/format-distance";

import { EXPLORE_IMAGES } from "../constants/explore-assets";
import { PoiDetailHero } from "./PoiDetailHero";

type PoiDetailScreenProps = {
  poiId: string;
  sourceQrCode?: string;
  onBack(): void;
};

export default function PoiDetailScreen({
  poiId,
  sourceQrCode,
  onBack,
}: PoiDetailScreenProps) {
  const theme = useTheme();
  const { languageCode } = useLanguagePreference();
  const { poi, errorMessage, isLoading } = usePublicPoi(poiId);
  const {
    narration,
    errorMessage: narrationError,
    isLoading: isNarrationLoading,
  } = usePublicPoiNarration(poiId, languageCode);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.notFound]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </ThemedView>
    );
  }

  if (!poi) {
    return (
      <ThemedView style={[styles.container, styles.notFound]}>
        <ThemedText color="textPrimary" style={theme.typography.heading}>
          {errorMessage ?? "Không tìm thấy địa điểm!"}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.notFoundBackButton}
        >
          <Text
            style={[
              theme.typography.bodyStrong,
              { color: theme.colors.primaryDark },
            ]}
          >
            Quay lại
          </Text>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PoiDetailHero
          imageUrl={poi.imageUrl}
          onBack={onBack}
          poiName={poi.name}
        />

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <ThemedText
                color="textPrimary"
                style={[theme.typography.heading, styles.title]}
              >
                {poi.name}
              </ThemedText>
              <ThemedText
                color="textSecondary"
                numberOfLines={1}
                style={theme.typography.supporting}
              >
                {poi.categories.join(" • ")}
              </ThemedText>
            </View>

            {poi.distanceMeters !== null ? <View
              style={[
                styles.distanceBadge,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Image
                source={EXPLORE_IMAGES.mapPin}
                style={[
                  styles.locationIcon,
                  { tintColor: theme.colors.primaryDark },
                ]}
              />
              <Text
                style={[
                  theme.typography.label,
                  { color: theme.colors.primaryDark },
                ]}
              >
                {formatDistance(poi.distanceMeters)}
              </Text>
            </View> : null}
          </View>

          {isNarrationLoading ? (
            <View style={styles.audioFeedback}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
              <ThemedText color="textSecondary">
                Loading published narration...
              </ThemedText>
            </View>
          ) : narration === null ? (
            <View
              style={[
                styles.audioFeedback,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <ThemedText color="textSecondary">
                {narrationError ?? "No published narration is available."}
              </ThemedText>
            </View>
          ) : (
            <>
              <ThemedText
                color="textPrimary"
                style={[theme.typography.sectionTitle, styles.narrationTitle]}
              >
                {narration.title}
              </ThemedText>
              {narration.isFallback ? (
                <ThemedText color="textSecondary" style={styles.fallbackNotice}>
                  The {narration.requestedLanguageCode} narration is unavailable.
                  Playing {narration.languageCode} instead.
                </ThemedText>
              ) : null}
              {sourceQrCode === undefined ? (
                <NarrationAudioPlayer
                  key={narration.contentId}
                  audioUrl={narration.audioUrl}
                  durationSeconds={narration.durationSeconds}
                />
              ) : (
                <QrAudioPlayer
                  key={narration.contentId}
                  qrCode={sourceQrCode}
                  contentId={narration.contentId}
                  audioUrl={narration.audioUrl}
                  durationSeconds={narration.durationSeconds}
                />
              )}
            </>
          )}

          <View style={styles.scriptSection}>
            <ThemedText
              color="textPrimary"
              style={[theme.typography.sectionTitle, styles.scriptTitle]}
            >
              Narration Script
            </ThemedText>
            <ThemedText
              color="textSecondary"
              style={[theme.typography.body, styles.scriptParagraph]}
            >
              {narration?.script ?? poi.description}
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
  notFound: {
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundBackButton: {
    marginTop: 20,
  },
  contentContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
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
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationIcon: {
    height: 14,
    marginRight: 4,
    width: 14,
  },
  scriptSection: {
    marginTop: 10,
  },
  audioFeedback: {
    alignItems: "center",
    borderRadius: 16,
    gap: 12,
    marginTop: 16,
    padding: 20,
  },
  narrationTitle: {
    marginTop: 8,
  },
  fallbackNotice: {
    marginTop: 6,
  },
  scriptTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  scriptParagraph: {
    marginBottom: 15,
  },
});
