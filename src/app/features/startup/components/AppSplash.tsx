import { Image, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export default function AppSplash() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/branding/splash-logo.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <ThemedText style={[theme.typography.title, styles.title]}>
          Multilingual Automatic{"\n"}
          Narration System
        </ThemedText>

        <ThemedText
          color="textSecondary"
          style={[theme.typography.subtitle, styles.subtitle]}
        >
          Stories of every place, spoken in your{"\n"}
          language
        </ThemedText>

        {/* Loading dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primaryLight }]} />
          <View style={[styles.dotActive, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.primaryLight }]} />
        </View>

        <ThemedText
          color="textSecondary"
          style={[theme.typography.caption, styles.loadingText]}
        >
          PREPARING YOUR JOURNEY
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: "60%",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 32,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    marginTop: 65,
    gap: 8,
  },
  dotActive: {
    width: 9,
    height: 9,
    borderRadius: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});