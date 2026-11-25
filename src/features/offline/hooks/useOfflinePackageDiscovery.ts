/**
 * Quản lý bộ lọc, phân trang và vòng đời request của package discovery.
 * Catalog và danh sách được tải độc lập để lỗi catalog không che mất package.
 */
import { useCallback, useEffect, useState } from "react";

import {
  getOfflinePackageCatalog,
  getPublishedOfflinePackages,
} from "../services/offlinePackages";
import type {
  OfflineFilterKind,
  OfflinePackageCatalog,
  OfflinePackageFilters,
  OfflinePackageSummary,
} from "../types/offline-package.types";

const INITIAL_FILTERS: OfflinePackageFilters = {
  regionId: null,
  languageId: null,
  categoryId: null,
};

export function useOfflinePackageDiscovery() {
  const [filters, setFilters] = useState<OfflinePackageFilters>(INITIAL_FILTERS);
  const [packages, setPackages] = useState<OfflinePackageSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [requestVersion, setRequestVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<OfflinePackageCatalog>({
    regions: [],
    languages: [],
    categories: [],
  });
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  useEffect(function loadCatalogEffect() {
    const controller = new AbortController();
    setIsCatalogLoading(true);
    setCatalogError(null);

    void getOfflinePackageCatalog(controller.signal)
      .then(function applyCatalog(value) {
        if (!controller.signal.aborted) {
          setCatalog(value);
        }
      })
      .catch(function handleCatalogError(cause: unknown) {
        if (!controller.signal.aborted) {
          setCatalogError(
            cause instanceof Error ? cause.message : "Không tải được bộ lọc.",
          );
        }
      })
      .finally(function finishCatalogLoading() {
        if (!controller.signal.aborted) {
          setIsCatalogLoading(false);
        }
      });

    return function cancelCatalogRequest() {
      controller.abort();
    };
  }, [requestVersion]);

  useEffect(function loadPackagesEffect() {
    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    // Khi bộ lọc thay đổi, không tiếp tục hiển thị package của bộ lọc cũ.
    if (offset === 0) {
      setPackages([]);
      setTotal(0);
    }

    void getPublishedOfflinePackages(filters, offset, controller.signal)
      .then(function applyPackages(page) {
        if (controller.signal.aborted) {
          return;
        }

        if (offset === 0) {
          setPackages(page.items);
        } else {
          setPackages(function appendPackages(current) {
            const knownIds = new Set(current.map(function getId(item) {
              return item.id;
            }));
            const additional = page.items.filter(function notLoaded(item) {
              return !knownIds.has(item.id);
            });
            return [...current, ...additional];
          });
        }

        setTotal(page.total);
      })
      .catch(function handlePackageError(cause: unknown) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            cause instanceof Error ? cause.message : "Không tải được các gói offline.",
          );
        }
      })
      .finally(function finishPackageLoading() {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return function cancelPackageRequest() {
      controller.abort();
    };
  }, [filters, offset, requestVersion]);

  const selectFilter = useCallback(function selectFilter(
    kind: OfflineFilterKind,
    id: string | null,
  ) {
    setFilters(function updateFilters(current) {
      return { ...current, [kind]: id };
    });
    setOffset(0);
  }, []);

  const clearFilters = useCallback(function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setOffset(0);
  }, []);

  const refresh = useCallback(function refresh() {
    setOffset(0);
    setRequestVersion(function nextVersion(current) {
      return current + 1;
    });
  }, []);

  const loadMore = useCallback(function loadMore() {
    if (!isLoading && errorMessage === null && packages.length < total) {
      setOffset(packages.length);
    }
  }, [errorMessage, isLoading, packages.length, total]);

  return {
    filters,
    selectFilter,
    clearFilters,
    refresh,
    loadMore,
    packages,
    total,
    isLoading,
    errorMessage,
    catalog,
    catalogError,
    isCatalogLoading,
    hasMore: packages.length < total,
    isLoadingMore: isLoading && offset > 0,
  };
}
