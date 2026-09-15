import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  title: string;
  description: string;
};

export default function DraftScreen({ title, description }: Props) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
      }}
    >
      <ThemedText accessibilityRole="header" style={theme.typography.heading}>
        {title}
      </ThemedText>
      <ThemedText color="textSecondary" style={theme.typography.body}>
        {description}
      </ThemedText>
      <ThemedText color="textMuted" style={theme.typography.caption}>
        Bản nháp — tính năng đang được phát triển.
      </ThemedText>
    </SafeAreaView>
  );
}
