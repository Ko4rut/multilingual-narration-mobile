/**
 * Chuẩn bị bộ font Noto Sans Regular để MapLibre vẽ nhãn tiếng Việt offline.
 *
 * Các file .pbf phải là require tĩnh để Metro đóng gói chúng trong APK.
 * Khi mở app, bộ font được sao chép vào document directory của ứng dụng.
 */
import { Directory, Paths } from "expo-file-system";

import {
  getInstalledAsset,
  isBundledAssetValid,
  prepareBundledAsset,
  type BundledAssetDefinition,
} from "./bundledAsset";

const FONT_NAME = "Noto Sans Regular";
const GLYPH_DIRECTORY = ["offline-map-glyphs", FONT_NAME];

/**
 * Thêm một dải Unicode tại đây và trong script fetch-hcm-glyphs.mjs nếu
 * dữ liệu Protomaps phát sinh ký tự ngoài các dải đã đóng gói.
 */
const GLYPH_DEFINITIONS: BundledAssetDefinition[] = [
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/0-255.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "0-255.pbf",
    expectedBytes: 76044,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/256-511.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "256-511.pbf",
    expectedBytes: 127726,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/512-767.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "512-767.pbf",
    expectedBytes: 94728,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/768-1023.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "768-1023.pbf",
    expectedBytes: 77034,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/1024-1279.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "1024-1279.pbf",
    expectedBytes: 125320,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/1280-1535.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "1280-1535.pbf",
    expectedBytes: 84434,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/7680-7935.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "7680-7935.pbf",
    expectedBytes: 135449,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/7936-8191.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "7936-8191.pbf",
    expectedBytes: 128630,
  },
  {
    assetModule: require("../../../../assets/glyphs/Noto Sans Regular/8192-8447.pbf"),
    directoryNames: GLYPH_DIRECTORY,
    fileName: "8192-8447.pbf",
    expectedBytes: 64220,
  },
];

export interface BundledGlyphsStatus {
  installedCount: number;
  totalCount: number;
  installedBytes: number;
  complete: boolean;
}

/** Kiểm tra từng file glyph đã thực sự có trên thiết bị hay chưa. */
export function getBundledGlyphsStatus(): BundledGlyphsStatus {
  let installedCount = 0;
  let installedBytes = 0;

  for (const definition of GLYPH_DEFINITIONS) {
    const file = getInstalledAsset(definition);

    if (isBundledAssetValid(file, definition)) {
      installedCount += 1;
      installedBytes += file.size;
    }
  }

  return {
    installedCount,
    installedBytes,
    totalCount: GLYPH_DEFINITIONS.length,
    complete: installedCount === GLYPH_DEFINITIONS.length,
  };
}

let preparationPromise: Promise<string> | null = null;

async function installBundledGlyphs(): Promise<string> {
  for (const definition of GLYPH_DEFINITIONS) {
    await prepareBundledAsset(definition);
  }

  // Cấu trúc thư mục phải trùng với {fontstack}/{range}.pbf trong MapLibre.
  const rootDirectory = new Directory(Paths.document, "offline-map-glyphs");
  const rootUri = rootDirectory.uri.replace(/\/+$/, "");

  return rootUri + "/{fontstack}/{range}.pbf";
}

/** Chia sẻ promise trong cùng một lần khởi động; thất bại thì cho phép thử lại. */
export function prepareBundledGlyphs(): Promise<string> {
  if (preparationPromise !== null) {
    return preparationPromise;
  }

  preparationPromise = installBundledGlyphs().catch(function handleGlyphInstallationFailure(error: unknown) {
    preparationPromise = null;
    throw error;
  });

  return preparationPromise;
}
