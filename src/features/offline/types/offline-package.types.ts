/** Kiểu dữ liệu cho danh sách package đã publish và bộ lọc public. */
export interface OfflinePackageSummary {
  id: string;
  regionId: string;
  languageId: string;
  categoryId: string | null;
  name: string;
  key: string;
  version: number;
  totalSizeBytes: number | null;
  publishedAt: string | null;
}

export interface OfflinePackagePage {
  items: OfflinePackageSummary[];
  total: number;
}

export interface OfflineFilterOption {
  id: string;
  label: string;
}

export interface OfflinePackageCatalog {
  regions: OfflineFilterOption[];
  languages: OfflineFilterOption[];
  categories: OfflineFilterOption[];
}

export interface OfflinePackageFilters {
  regionId: string | null;
  languageId: string | null;
  categoryId: string | null;
}

export type OfflineFilterKind = keyof OfflinePackageFilters;
