import { StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export function QrScanInstructions() {
  const theme = useTheme();

  return (
    <View style={[styles.bottomPanel, { backgroundColor: theme.colors.background }]}>
      <ThemedText
        style={[
          theme.typography.title,
          styles.title,
          { color: theme.colors.textPrimary },
        ]}
      >
        Direct Scan Feature
      </ThemedText>
      <ThemedText
        color="textSecondary"
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[theme.typography.body, styles.subtitle]}
      >
        Tap instantly on any local physical signpost QR codes
      </ThemedText>
      <View style={[styles.tipBox, { backgroundColor: theme.colors.card }]}>
        <View style={styles.iconWrapper}>
          <SymbolView
            name={{
              ios: "lightbulb",
              android: "lightbulb",
              web: "lightbulb",
            }}
            size={20}
            tintColor={theme.colors.primaryDark}
          />
        </View>
        <ThemedText
          color="textSecondary"
          style={[theme.typography.caption, styles.tipText]}
        >
          Scanning automatically downloads the correct language package and begins the audio narrative immediately.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomPanel: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 29,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13.5,
    letterSpacing: -0.15,
    lineHeight: 19,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 10,
  },
  iconWrapper: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
