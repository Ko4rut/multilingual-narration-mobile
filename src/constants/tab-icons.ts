import { Image, type ImageRef } from "expo-image";

import { AppTheme } from "@/constants/theme";

export const tabIcons = {
  index: require("@/assets/images/tabIcons/explore.png"),
  map: require("@/assets/images/tabIcons/marker.png"),
  "qr-scan": require("@/assets/images/tabIcons/scan-qr-code.png"),
  offline: require("@/assets/images/tabIcons/offline-package.png"),
  settings: require("@/assets/images/tabIcons/settings.png"),
} satisfies Record<string, number>;

export type TabName = keyof typeof tabIcons;

// Keep decoded native images alive and reuse them when the tab bar mounts.
const loadedIcons = new Map<string, ImageRef>();
const iconColors = [...new Set([
  AppTheme.light.colors.white,
  AppTheme.dark.colors.white,
  AppTheme.light.colors.textSecondary,
  AppTheme.dark.colors.textSecondary,
])];

export async function loadTabIcons() {
  await Promise.all((Object.keys(tabIcons) as TabName[]).flatMap((name) =>
    iconColors.map(async (tintColor) => {
      const key = `${name}:${tintColor}`;
      if (!loadedIcons.has(key)) {
        // ImageRef sources need tint applied while decoding, not on the view.
        loadedIcons.set(key, await Image.loadAsync(tabIcons[name], { tintColor }));
      }
    }),
  ));
}

export function getTabIcon(name: TabName, color: string) {
  return loadedIcons.get(`${name}:${color}`) ?? tabIcons[name];
}
