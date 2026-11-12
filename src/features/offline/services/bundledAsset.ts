/**
 * Chuẩn bị một tài nguyên nhị phân đã có sẵn trong bản build.
 *
 * Expo Asset cung cấp file nguồn cục bộ. MapLibre cần một file ổn định trong
 * thư mục document của ứng dụng để đọc ngẫu nhiên (byte-range).
 * Không tải tile hoặc glyph từ Internet tại đây trong bản release.
 */
import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";

export interface BundledAssetValidator {
  (file: File): boolean;
}

export interface BundledAssetDefinition {
  assetModule: number;
  directoryNames: string[];
  fileName: string;
  expectedBytes: number;
  validateContent?: BundledAssetValidator;
}

/** Kiểm tra cả kích thước và nội dung đặc thù nếu tài nguyên có validator. */
export function isBundledAssetValid(
  file: File,
  definition: BundledAssetDefinition,
): boolean {
  if (!file.exists) {
    return false;
  }

  if (file.size !== definition.expectedBytes) {
    return false;
  }

  if (definition.validateContent) {
    try {
      return definition.validateContent(file);
    } catch {
      return false;
    }
  }

  return true;
}

/** Dùng để kiểm tra trạng thái mà không tạo thư mục hoặc tải lại tài nguyên. */
export function getInstalledAsset(
  definition: BundledAssetDefinition,
): File {
  return new File(Paths.document, ...definition.directoryNames, definition.fileName);
}

function createDestinationDirectory(definition: BundledAssetDefinition): Directory {
  const directory = new Directory(Paths.document, ...definition.directoryNames);
  directory.create({ idempotent: true, intermediates: true });
  return directory;
}

/**
 * Lấy tài nguyên nhúng từ Expo Asset.
 *
 * Trong development build, Metro có thể cung cấp asset qua mạng nội bộ.
 * Trong release APK, nội dung được đóng gói cùng ứng dụng.
 */
async function getSourceFile(definition: BundledAssetDefinition): Promise<File> {
  const asset = Asset.fromModule(definition.assetModule);
  await asset.downloadAsync();

  if (!asset.localUri || !asset.localUri.startsWith("file://")) {
    throw new Error("Không tìm thấy tài nguyên offline trong bản build: " + definition.fileName);
  }

  const source = new File(asset.localUri);
  if (!isBundledAssetValid(source, definition)) {
    throw new Error("Tài nguyên offline sai định dạng hoặc kích thước: " + definition.fileName);
  }

  return source;
}

/**
 * Sao chép qua file .partial rồi mới đổi tên để MapLibre không thấy file dở.
 *
 * CẢNH BÁO: Expo File.move() thay đổi URI trên chính đối tượng stagingFile.
 * Không được xóa stagingFile trong finally sau move(), vì sẽ xóa nhầm file đích.
 */
export async function prepareBundledAsset(
  definition: BundledAssetDefinition,
): Promise<File> {
  const directory = createDestinationDirectory(definition);
  const destination = new File(directory, definition.fileName);

  if (isBundledAssetValid(destination, definition)) {
    return destination;
  }

  // Không công bố bản cũ nếu nó thiếu dữ liệu hoặc không hợp lệ.
  if (destination.exists) {
    destination.delete();
  }

  const source = await getSourceFile(definition);
  const stagingFile = new File(directory, definition.fileName + ".partial");
  const stagingUri = stagingFile.uri;

  if (stagingFile.exists) {
    stagingFile.delete();
  }

  try {
    await source.copy(stagingFile);

    if (!isBundledAssetValid(stagingFile, definition)) {
      throw new Error("Sao chép tài nguyên offline chưa hoàn tất: " + definition.fileName);
    }

    await stagingFile.move(destination);

    if (!isBundledAssetValid(destination, definition)) {
      throw new Error("File offline không tồn tại ở đường dẫn đích: " + definition.fileName);
    }

    return destination;
  } finally {
    // Luôn tham chiếu URI gốc của file tạm, không tham chiếu stagingFile.
    const unfinishedFile = new File(stagingUri);
    if (unfinishedFile.exists) {
      unfinishedFile.delete();
    }
  }
}
