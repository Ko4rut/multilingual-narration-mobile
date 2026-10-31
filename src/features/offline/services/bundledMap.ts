/**
 * Chuẩn bị bản đồ TP.HCM được đóng gói trong APK.
 *
 * PMTiles được sao chép một lần vào document directory. Những lần mở app sau,
 * file hợp lệ được tái sử dụng; không cần mạng và không dùng OfflineManager.
 */
import { File, FileMode } from "expo-file-system";

import mapManifest from "../../../../assets/maps/hcm-metropolitan.manifest.json";
import {
  getInstalledAsset,
  isBundledAssetValid,
  prepareBundledAsset,
  type BundledAssetDefinition,
} from "./bundledAsset";

const mapAssetModule = require("../../../../assets/maps/hcm-metropolitan.pmtiles");
const mapArchiveName =
  "hcm-metropolitan-" + mapManifest.sha256.substring(0, 16) + ".pmtiles";

const PMTILES_MAGIC = [80, 77, 84, 105, 108, 101, 115];

/** Đọc đúng 7 byte header, không nạp toàn bộ PMTiles vào RAM. */
function hasPmtilesHeader(file: File): boolean {
  const handle = file.open(FileMode.ReadOnly);

  try {
    const header = handle.readBytesSync(PMTILES_MAGIC.length);
    if (header.length !== PMTILES_MAGIC.length) {
      return false;
    }

    for (let index = 0; index < PMTILES_MAGIC.length; index += 1) {
      if (header[index] !== PMTILES_MAGIC[index]) {
        return false;
      }
    }

    return true;
  } finally {
    handle.close();
  }
}

const mapDefinition: BundledAssetDefinition = {
  assetModule: mapAssetModule,
  directoryNames: ["offline-maps"],
  fileName: mapArchiveName,
  expectedBytes: mapManifest.sizeBytes,
  validateContent: hasPmtilesHeader,
};

export interface BundledMapStatus {
  available: boolean;
  installedBytes: number;
  expectedBytes: number;
  version: string;
}

/** Trạng thái thực của file hiện có, không chỉ là thông báo tĩnh trên UI. */
export function getBundledMapStatus(): BundledMapStatus {
  const file = getInstalledAsset(mapDefinition);
  const available = isBundledAssetValid(file, mapDefinition);
  let installedBytes = 0;

  if (available) {
    installedBytes = file.size;
  }

  return {
    available,
    installedBytes,
    expectedBytes: mapDefinition.expectedBytes,
    version: mapManifest.sha256.substring(0, 12),
  };
}

let preparationPromise: Promise<string> | null = null;

async function installBundledMap(): Promise<string> {
  const file = await prepareBundledAsset(mapDefinition);

  // MapLibre Native cần URL pmtiles://file://..., không dùng pmtiles://asset://.
  return "pmtiles://" + file.uri;
}

/** Các lời gọi đồng thời chia sẻ cùng một tác vụ, lỗi có thể thử lại. */
export function prepareBundledMap(): Promise<string> {
  if (preparationPromise !== null) {
    return preparationPromise;
  }

  preparationPromise = installBundledMap().catch(function handleInstallationFailure(error: unknown) {
    preparationPromise = null;
    throw error;
  });

  return preparationPromise;
}
