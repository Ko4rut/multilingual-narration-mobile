import { Colors } from "./colors";

// Tên font phải trùng với key đã đăng ký trong startup font loader.
export const FontFamily = {
  regular: "Lora-Regular",
  bold: "Lora-Bold",
} as const;

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
    pill: 9996,
  },
  shadows: {
    floating: {
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.13,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  typography: {
    heroTitle: {
      fontFamily: FontFamily.bold,
      fontSize: 32,
      lineHeight: 40,
    },
    title: {
      fontFamily: FontFamily.bold,
      fontSize: 28,
      lineHeight: 36,
    },
    heading: {
      fontFamily: FontFamily.bold,
      fontSize: 24,
      lineHeight: 28,
    },
    sectionTitle: {
      fontFamily: FontFamily.bold,
      fontSize: 16,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    bodyStrong: {
      fontSize: 16,
      fontWeight: "700" as const,
      lineHeight: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: "500" as const,
      lineHeight: 20,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 20,
    },
    supporting: {
      fontSize: 16,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
    overline: {
      fontSize: 12,
      fontWeight: "600" as const,
      lineHeight: 16,
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
