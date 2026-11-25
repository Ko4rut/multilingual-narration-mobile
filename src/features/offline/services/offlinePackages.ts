/**
 * API public cho Offline Package Discovery.
 * Chỉ đọc metadata; không tải manifest, audio hay ghi dữ liệu offline.
 */
import { getApiBaseUrl } from "@/services/api-base-url";

import type {
  OfflineFilterOption,
  OfflinePackageCatalog,
  OfflinePackageFilters,
  OfflinePackagePage,
  OfflinePackageSummary,
} from "../types/offline-package.types";

export const OFFLINE_PAGE_SIZE = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error("Không thể tải dữ liệu offline (HTTP " + response.status + ").");
  }
  return response.json() as Promise<unknown>;
}

function parseCatalogOptions(
  value: unknown,
  labelField: string,
): OfflineFilterOption[] {
  if (!Array.isArray(value)) {
    throw new Error("Danh mục bộ lọc từ Backend không hợp lệ.");
  }

  return value.map(function parseOption(item: unknown): OfflineFilterOption {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item[labelField] !== "string"
    ) {
      throw new Error("Thiếu ID hoặc tên trong danh mục Backend.");
    }

    return { id: item.id, label: item[labelField] as string };
  });
}

/** Tên bộ lọc lấy từ catalog public, không suy diễn từ package_name. */
export async function getOfflinePackageCatalog(
  signal?: AbortSignal,
): Promise<OfflinePackageCatalog> {
  const origin = await getApiBaseUrl();
  const catalogUrl = origin + "/api/v1/catalog/";
  const [regions, languages, categories] = await Promise.all([
    fetchJson(catalogUrl + "regions", signal),
    fetchJson(catalogUrl + "languages", signal),
    fetchJson(catalogUrl + "categories", signal),
  ]);

  return {
    regions: parseCatalogOptions(regions, "region_name"),
    languages: parseCatalogOptions(languages, "language_name"),
    categories: parseCatalogOptions(categories, "category_name"),
  };
}

function parsePublishedPackage(value: unknown): OfflinePackageSummary {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.region_id !== "string" ||
    typeof value.language_id !== "string" ||
    typeof value.package_name !== "string" ||
    typeof value.package_key !== "string" ||
    typeof value.package_version !== "number" ||
    !Number.isInteger(value.package_version) ||
    value.package_version < 1 ||
    value.package_status !== "PUBLISHED"
  ) {
    throw new Error("Metadata Offline Package trả về không hợp lệ.");
  }

  if (
    (value.category_id !== null && typeof value.category_id !== "string") ||
    (value.total_size !== null &&
      (typeof value.total_size !== "number" || value.total_size < 0)) ||
    (value.published_at !== null && typeof value.published_at !== "string")
  ) {
    throw new Error("Metadata Offline Package có trường không hợp lệ.");
  }

  return {
    id: value.id,
    regionId: value.region_id,
    languageId: value.language_id,
    categoryId: value.category_id,
    name: value.package_name,
    key: value.package_key,
    version: value.package_version,
    totalSizeBytes: value.total_size,
    publishedAt: value.published_at,
  };
}

/** Query Backend thực sự dùng các ID, có hỗ trợ phân trang. */
export async function getPublishedOfflinePackages(
  filters: OfflinePackageFilters,
  offset: number,
  signal?: AbortSignal,
): Promise<OfflinePackagePage> {
  const origin = await getApiBaseUrl();
  const query = new URLSearchParams({
    offset: String(offset),
    limit: String(OFFLINE_PAGE_SIZE),
  });

  if (filters.regionId !== null) {
    query.set("region_id", filters.regionId);
  }
  if (filters.languageId !== null) {
    query.set("language_id", filters.languageId);
  }
  if (filters.categoryId !== null) {
    query.set("category_id", filters.categoryId);
  }

  const response = await fetchJson(
    origin + "/api/v1/offline/packages?" + query.toString(),
    signal,
  );

  if (
    !isRecord(response) ||
    !Array.isArray(response.items) ||
    typeof response.total !== "number" ||
    !Number.isInteger(response.total) ||
    response.total < 0
  ) {
    throw new Error("Danh sách Offline Package từ Backend không hợp lệ.");
  }

  return {
    items: response.items.map(parsePublishedPackage),
    total: response.total,
  };
}
