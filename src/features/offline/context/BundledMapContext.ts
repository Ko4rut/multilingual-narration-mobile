import { createContext, useContext } from "react";
export type BundledMapResources = { pmtilesUri: string; glyphsUrl: string };
export const BundledMapUriContext = createContext<BundledMapResources | null>(null);
export function useBundledMapResources(): BundledMapResources {
  const resources = useContext(BundledMapUriContext);
  if (!resources) throw new Error("Offline HCMC map resources are not initialized.");
  return resources;
}
