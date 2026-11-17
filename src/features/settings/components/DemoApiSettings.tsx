/** Form cấu hình IP/host của laptop để điện thoại gọi backend khi demo. */
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

import { useDemoApiSettings } from "../hooks/useDemoApiSettings";

export function DemoApiSettings() {
  const theme = useTheme();
  const apiSettings = useDemoApiSettings();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
        },
      ]}
    >
      <Text
        style={[theme.typography.label, { color: theme.colors.textPrimary }]}
      >
        Laptop API address
      </Text>
      <Text
        style={[
          theme.typography.caption,
          { color: theme.colors.textSecondary },
        ]}
      >
        Enter the laptop LAN address, for example 192.168.1.20:8000.
      </Text>
      <TextInput
        accessibilityLabel="Laptop API address"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        onChangeText={apiSettings.setValue}
        placeholder="192.168.1.20:8000"
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            color: theme.colors.textPrimary,
          },
        ]}
        value={apiSettings.value}
      />
      <Pressable
        accessibilityRole="button"
        disabled={apiSettings.isSaving}
        onPress={function handleSavePress() {
          void apiSettings.save();
        }}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.sm,
            opacity: apiSettings.isSaving ? 0.6 : 1,
          },
        ]}
      >
        {apiSettings.isSaving ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={[theme.typography.label, { color: theme.colors.white }]}> 
            Save API address
          </Text>
        )}
      </Pressable>
      {apiSettings.message !== null ? (
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textSecondary },
          ]}
        >
          {apiSettings.message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  input: { borderWidth: 1, minHeight: 44, paddingHorizontal: 12 },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 16,
  },
});
