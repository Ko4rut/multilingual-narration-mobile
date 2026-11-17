/** Chọn API URL đã lưu trong Settings, sau đó mới fallback về biến môi trường. */
import { getSavedDemoApiBaseUrl } from "@/features/settings/services/demo-api-settings";

export async function getApiBaseUrl(): Promise<string> {
  const savedUrl = await getSavedDemoApiBaseUrl();

  if (savedUrl !== null) {
    return savedUrl;
  }

  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (typeof configuredUrl !== "string" || configuredUrl.trim().length === 0) {
    throw new Error("Configure the API address in Settings before continuing.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(configuredUrl.trim());
  } catch (cause) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not a valid URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("The API base URL must use HTTP or HTTPS.");
  }

  return parsedUrl.origin;
}

/** Đổi host localhost trong asset URL sang IP laptop mà điện thoại đang dùng. */
export function normalizeBackendAssetUrl(
  rawAssetUrl: string,
  apiBaseUrl: string,
): string {
  const assetUrl = new URL(rawAssetUrl);
  const apiUrl = new URL(apiBaseUrl);

  if (assetUrl.protocol !== "http:" && assetUrl.protocol !== "https:") {
    throw new Error("Backend asset URL must use HTTP or HTTPS.");
  }

  if (assetUrl.hostname === "localhost" || assetUrl.hostname === "127.0.0.1") {
    if (apiUrl.hostname !== "localhost" && apiUrl.hostname !== "127.0.0.1") {
      assetUrl.protocol = apiUrl.protocol;
      assetUrl.host = apiUrl.host;
    }
  }

  return assetUrl.toString();
}
