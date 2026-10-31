/** Chia sẻ địa chỉ file cục bộ sau khi đã hoàn tất chuẩn bị dữ liệu offline. */
import { createContext, useContext } from "react";

export interface BundledMapResources {
  /** MapLibre đọc PMTiles bằng giao thức pmtiles://file://. */
  pmtilesUri: string;
  /** Mẫu đường dẫn file glyph: file://.../{fontstack}/{range}.pbf. */
  glyphsUrl: string;
}

export const BundledMapUriContext = createContext<BundledMapResources | null>(null);

export function useBundledMapResources(): BundledMapResources {
  const resources = useContext(BundledMapUriContext);

  if (resources === null) {
    throw new Error("Các tài nguyên bản đồ offline chưa được chuẩn bị.");
  }

  return resources;
}
