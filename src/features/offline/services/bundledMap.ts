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

  // Copy to a staging filename before publishing the archive.
  const temp = new File(directory, archiveName + ".partial");
  // File.move() MUTATES the File object's uri to the destination path.
  // Retain the *original* temporary URI so cleanup can never delete the moved archive.
  const temporaryUri = temp.uri;
  if (temp.exists) temp.delete();

  try {
    await source.copy(temp);
    if (!temp.exists || temp.size !== manifest.sizeBytes) {
      throw new Error("Sao chép bản đồ chưa hoàn tất.");
    }

    await temp.move(destination);
    // Verify the final path before allowing MapLibre to load the source.
    if (!destination.exists || destination.size !== manifest.sizeBytes) {
      throw new Error("Không tìm thấy PMTiles ở đường dẫn lưu trữ cuối cùng.");
    }

    return `pmtiles://${destination.uri}`;
  } finally {
    // IMPORTANT: do not check temp.exists here: after move() it points at
    // destination.uri and deleting it would erase the ready-to-use map.
    const leftover = new File(temporaryUri);
    if (leftover.exists) leftover.delete();
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
