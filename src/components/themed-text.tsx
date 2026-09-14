import {
  Text,
  type TextProps,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";


type ThemeTextColor =
  | "textPrimary"
  | "textSecondary"
  | "textMuted";


type Props = TextProps & {
  color?: ThemeTextColor;
};


export function ThemedText({
  style,
  color = "textPrimary",
  ...props
}: Props) {


  const theme = useTheme();


  return (
    <Text

      style={[
        {
          color: theme.colors[color],
        },

        style

      ]}

      {...props}

    />
  );
}