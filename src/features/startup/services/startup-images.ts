import { Image, type ImageRef } from "expo-image";

import { startupImages } from "../constants/startup-assets";

type StartupImageName = keyof typeof startupImages;

// Retain decoded images so screens can reuse them after startup completes.
const loadedImages = new Map<StartupImageName, ImageRef>();

export async function loadStartupImages() {
  await Promise.all(
    (Object.keys(startupImages) as StartupImageName[]).map(async (name) => {
      if (!loadedImages.has(name)) {
        loadedImages.set(name, await Image.loadAsync(startupImages[name]));
      }
    }),
  );
}

export function getStartupImage(name: StartupImageName) {
  return loadedImages.get(name) ?? startupImages[name];
}
