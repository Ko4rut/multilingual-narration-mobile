import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

export default function ExploreScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={{ flex: 1, padding: theme.spacing.md }}>
      <ThemedText style={theme.typography.heading}>Explore</ThemedText>
    </ThemedView>
  );
}
