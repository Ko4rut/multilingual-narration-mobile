import { useColorScheme } from "react-native";

import { AppTheme } from "@/constants/theme";


export function useTheme() {

  const colorScheme = useColorScheme();

  return colorScheme === "dark"
    ? AppTheme.dark
    : AppTheme.light;

}