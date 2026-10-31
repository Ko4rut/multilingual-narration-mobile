/** The map source URI is available only after the bundled archive is ready. */
import { createContext, useContext } from "react";

export const BundledMapUriContext = createContext<string | null>(null);

export function useBundledMapUri(): string {
  const uri = useContext(BundledMapUriContext);
  if (!uri) {
    throw new Error("Bundled HCMC map is not initialized.");
  }
  return uri;
}
