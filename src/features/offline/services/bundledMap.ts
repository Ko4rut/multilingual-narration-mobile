/** Extract the bundled PMTiles asset to a readable local file for native byte-range access. */
import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";
import manifest from "../../../../assets/maps/hcm-metropolitan.manifest.json";

// Metro treats this binary as an asset. In a release APK it is bundled locally.
const bundledArchive = require("../../../../assets/maps/hcm-metropolitan.pmtiles");
const archiveName = `hcm-metropolitan-${manifest.sha256.slice(0, 16)}.pmtiles`;

let pending: Promise<string> | null = null;

async function prepare(): Promise<string> {
  const directory = new Directory(Paths.document, "offline-maps");
  directory.create({ idempotent: true, intermediates: true });

  const destination = new File(directory, archiveName);
  if (destination.exists && destination.size === manifest.sizeBytes) {
    return `pmtiles://${destination.uri}`;
  }

  if (destination.exists) destination.delete();

  const asset = Asset.fromModule(bundledArchive);
  await asset.downloadAsync();
  if (!asset.localUri?.startsWith("file://")) {
    throw new Error("Bản đồ nhúng chưa có đường dẫn file cục bộ. Vui lòng build lại ứng dụng.");
  }

  const source = new File(asset.localUri);
  if (!source.exists || source.size !== manifest.sizeBytes) {
    throw new Error("File PMTiles nhúng thiếu hoặc sai kích thước.");
  }

  // The temporary file is never exposed to MapLibre, even after an interrupted copy.
  const temp = new File(directory, archiveName + ".partial");
  if (temp.exists) temp.delete();

  try {
    await source.copy(temp);
    if (temp.size !== manifest.sizeBytes) {
      throw new Error("Sao chép bản đồ chưa hoàn tất.");
    }
    const checksum = await temp.digest("SHA-256");
    if (checksum.toLowerCase() !== manifest.sha256.toLowerCase()) {
      throw new Error("Bản đồ không khớp checksum SHA-256.");
    }
    await temp.move(destination);
    return `pmtiles://${destination.uri}`;
  } finally {
    if (temp.exists) temp.delete();
  }
}

/** A failed attempt can be retried; concurrent mounts share one preparation. */
export function prepareBundledMap(): Promise<string> {
  if (!pending) {
    pending = prepare().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}
