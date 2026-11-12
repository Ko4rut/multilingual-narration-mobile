/** Chi tiết POI và script narration lấy từ public Backend API. */
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

import { usePoiDetail } from "../hooks/usePoiDetail";
import type { PoiDetailScreenProps } from "../types/explore.types";
import { PoiDetailHero } from "./PoiDetailHero";
import { PoiNarrationPlayer } from "./PoiNarrationPlayer";

export default function PoiDetailScreen({ poiId, onBack }: PoiDetailScreenProps) {
  const theme = useTheme();
  // Settings chưa được đồng bộ với narration; dùng ngôn ngữ mặc định English.
  const { poi, narration, loading, error, narrationError, retry } = usePoiDetail(poiId);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.feedback]}>
        <ActivityIndicator color={theme.colors.primaryDark} />
        <ThemedText color="textSecondary">Đang tải chi tiết địa điểm...</ThemedText>
      </ThemedView>
    );
  }

  if (!poi) {
    return (
      <ThemedView style={[styles.container, styles.feedback]}>
        <ThemedText style={theme.typography.heading}>
          {error?.includes("404") ? "Không tìm thấy địa điểm!" : "Không thể tải địa điểm."}
        </ThemedText>
        {error && <ThemedText color="textSecondary">{error}</ThemedText>}
        <Pressable onPress={retry} accessibilityRole="button" style={styles.action}>
          <ThemedText>Thử lại</ThemedText>
        </Pressable>
        <Pressable onPress={onBack} accessibilityRole="button" style={styles.action}>
          <ThemedText>Quay lại</ThemedText>
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
          <ThemedText style={[theme.typography.heading, styles.title]}>
            {poi.name}
          </ThemedText>
          <ThemedText color="textSecondary" style={[theme.typography.supporting, styles.location]}>
            {poi.description}
          </ThemedText>

          <PoiNarrationPlayer poiName={poi.name} narration={narration} />

          {narrationError ? (
            <ThemedText color="textSecondary">
              Không thể tải nội dung thuyết minh: {narrationError}
            </ThemedText>
          ) : narration ? (
            <View style={styles.scriptSection}>
              <ThemedText style={[theme.typography.sectionTitle, styles.scriptTitle]}>
                {narration.narration_title}
              </ThemedText>
              {narration.is_fallback && (
                <ThemedText color="textSecondary" style={styles.scriptParagraph}>
                  Chưa có nội dung cho ngôn ngữ yêu cầu, đang dùng bản tiếng Anh.
                </ThemedText>
              )}
              <ThemedText color="textSecondary" style={[theme.typography.body, styles.scriptParagraph]}>
                {narration.narration_script}
              </ThemedText>
            </View>
          ) : (
            <ThemedText color="textSecondary">
              Chưa có bản thuyết minh đã xuất bản cho địa điểm này.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  feedback: { alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  action: { paddingHorizontal: 24, paddingVertical: 10 },
  contentContainer: { paddingBottom: 40, paddingHorizontal: 20, paddingTop: 20 },
  title: { marginBottom: 8 },
  location: { marginBottom: 24 },
  scriptSection: { marginTop: 14 },
  scriptTitle: { marginBottom: 15 },
  scriptParagraph: { marginBottom: 15 },
});
