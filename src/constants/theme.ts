import { Colors } from "./colors";

const BaseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    pill: 999,
  },
  typography: {
    heroTitle: {
      fontFamily: "Lora",
      fontSize: 32,
      fontWeight: "800" as const,
      lineHeight: 38,
    },
    title: {
      fontFamily: "Lora",
      fontSize: 28,
      fontWeight: "800" as const,
      lineHeight: 34,
    },
    heading: {
      fontFamily: "serif",
      fontSize: 22,
      fontWeight: "700" as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 20,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
    },
  },
};

export const AppTheme = {
  light: {
    ...BaseTheme,
    colors: Colors.light,
  },
  dark: {
    ...BaseTheme,
    colors: Colors.dark,
  },
};