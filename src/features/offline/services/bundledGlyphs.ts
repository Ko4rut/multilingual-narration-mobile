import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";

const glyphs = [
  { name: "0-255.pbf", bytes: 76044, module: require("../../../../assets/glyphs/Noto Sans Regular/0-255.pbf") },
  { name: "256-511.pbf", bytes: 127726, module: require("../../../../assets/glyphs/Noto Sans Regular/256-511.pbf") },
  { name: "512-767.pbf", bytes: 94728, module: require("../../../../assets/glyphs/Noto Sans Regular/512-767.pbf") },
  { name: "768-1023.pbf", bytes: 77034, module: require("../../../../assets/glyphs/Noto Sans Regular/768-1023.pbf") },
  { name: "1024-1279.pbf", bytes: 125320, module: require("../../../../assets/glyphs/Noto Sans Regular/1024-1279.pbf") },
  { name: "1280-1535.pbf", bytes: 84434, module: require("../../../../assets/glyphs/Noto Sans Regular/1280-1535.pbf") },
  { name: "7680-7935.pbf", bytes: 135449, module: require("../../../../assets/glyphs/Noto Sans Regular/7680-7935.pbf") },
  { name: "7936-8191.pbf", bytes: 128630, module: require("../../../../assets/glyphs/Noto Sans Regular/7936-8191.pbf") },
  { name: "8192-8447.pbf", bytes: 64220, module: require("../../../../assets/glyphs/Noto Sans Regular/8192-8447.pbf") },
] as const;
let pending: Promise<string> | null = null;

async function prepare(): Promise<string> {
  const root = new Directory(Paths.document, "offline-map-glyphs");
  root.create({ intermediates: true, idempotent: true });
  const font = new Directory(root, "Noto Sans Regular");
  font.create({ intermediates: true, idempotent: true });

  for (const { name, bytes, module } of glyphs) {
    const destination = new File(font, name);
    if (destination.exists && destination.size === bytes) continue;
    if (destination.exists) destination.delete();
    const asset = Asset.fromModule(module);
    await asset.downloadAsync();
    if (!asset.localUri?.startsWith("file://")) throw new Error("Font offline chưa được đóng gói: " + name);
    const source = new File(asset.localUri);
    if (!source.exists || source.size !== bytes) throw new Error("Font bị thiếu hoặc sai kích thước: " + name);

    const temporary = new File(font, name + ".partial");
    const initialUri = temporary.uri;
    if (temporary.exists) temporary.delete();
    try {
      await source.copy(temporary);
      if (!temporary.exists || temporary.size !== bytes) throw new Error("Không thể sao chép font: " + name);
      await temporary.move(destination);
      if (!destination.exists || destination.size !== bytes) throw new Error("Không lưu được font: " + name);
    } finally {
      // File.move mutates the File URI. Only delete the old staging path.
      const leftover = new File(initialUri);
      if (leftover.exists) leftover.delete();
    }
  }
  return root.uri.replace(/\/+$/, "") + "/{fontstack}/{range}.pbf";
}
export function prepareBundledGlyphs(): Promise<string> {
  if (!pending) pending = prepare().catch((cause: unknown) => { pending = null; throw cause; });
  return pending;
}
