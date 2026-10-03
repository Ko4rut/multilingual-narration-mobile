/** Quản lý query và danh sách POI đã lọc cho map bottom sheet. */
import { useMemo, useState } from "react";

import type { PointOfInterest } from "../types";

function filterPoisByName(pois: PointOfInterest[], searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("en");

  if (!normalizedQuery) {
    return pois;
  }

  return pois.filter((poi) =>
    poi.name.toLocaleLowerCase("en").includes(normalizedQuery),
  );
}

export function usePoiSearch(pois: PointOfInterest[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPois = useMemo(
    () => filterPoisByName(pois, searchQuery),
    [pois, searchQuery],
  );

  function clearSearch() {
    setSearchQuery("");
  }

  return {
    clearSearch,
    filteredPois,
    searchQuery,
    setSearchQuery,
  };
}
