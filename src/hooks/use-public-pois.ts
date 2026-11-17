/** Tải danh sách POI public và tính khoảng cách từ vị trí thiết bị. */
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getPublicPoi,
  getPublicPoiNarration,
  getPublicPois,
  type PublicPoi,
  type PublicPoiNarration,
} from "@/services/public-pois.api";

type Coordinate = { latitude: number; longitude: number } | null;

function toRadians(value: number): number {
  return value * (Math.PI / 180);
}

function calculateDistanceMeters(from: Coordinate, poi: PublicPoi): number | null {
  if (from === null) {
    return null;
  }

  const earthRadiusMeters = 6_371_000;
  const latitudeDelta = toRadians(poi.latitude - from.latitude);
  const longitudeDelta = toRadians(poi.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const poiLatitude = toRadians(poi.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(poiLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return Math.round(
    2 * earthRadiusMeters * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)),
  );
}

export function usePublicPois(currentLocation: Coordinate) {
  const [pois, setPois] = useState<PublicPoi[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestVersion, setRequestVersion] = useState(0);

  const reload = useCallback(function reload(): void {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(function loadPois() {
    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    void getPublicPois(controller.signal)
      .then(function applyPois(page) {
        setPois(page.items);
      })
      .catch(function handlePoiError(cause: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        setErrorMessage(
          cause instanceof Error ? cause.message : "Unable to load points of interest.",
        );
      })
      .finally(function finishLoading() {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return function cancelPoiRequest() {
      controller.abort();
    };
  }, [requestVersion]);

  const poisWithDistance = useMemo(
    () =>
      pois.map((poi) => ({
        ...poi,
        distanceMeters: calculateDistanceMeters(currentLocation, poi),
      })),
    [currentLocation, pois],
  );

  return { pois: poisWithDistance, errorMessage, isLoading, reload };
}

/** Tải một POI public cho màn hình chi tiết. */
export function usePublicPoi(poiId: string) {
  const [poi, setPoi] = useState<PublicPoi | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function loadPoi() {
    const controller = new AbortController();
    setPoi(null);
    setErrorMessage(null);
    setIsLoading(true);

    void getPublicPoi(poiId, controller.signal)
      .then(setPoi)
      .catch(function handlePoiError(cause: unknown) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            cause instanceof Error ? cause.message : "Unable to load this place.",
          );
        }
      })
      .finally(function finishLoading() {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return function cancelPoiRequest() {
      controller.abort();
    };
  }, [poiId]);

  return { poi, errorMessage, isLoading };
}

/** Tải narration đã publish theo ngôn ngữ đang chọn trong Settings. */
export function usePublicPoiNarration(poiId: string, languageCode: string) {
  const [narration, setNarration] = useState<PublicPoiNarration | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function loadNarration() {
    const controller = new AbortController();
    setNarration(null);
    setErrorMessage(null);
    setIsLoading(true);

    void getPublicPoiNarration(poiId, languageCode, controller.signal)
      .then(setNarration)
      .catch(function handleNarrationError(cause: unknown) {
        if (!controller.signal.aborted) {
          setErrorMessage(
            cause instanceof Error
              ? cause.message
              : "Unable to load the published narration.",
          );
        }
      })
      .finally(function finishLoading() {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return function cancelNarrationRequest() {
      controller.abort();
    };
  }, [languageCode, poiId]);

  return { narration, errorMessage, isLoading };
}
