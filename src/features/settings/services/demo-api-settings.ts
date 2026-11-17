/** Lưu địa chỉ backend dùng khi demo trên thiết bị thật. */
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEMO_API_BASE_URL_KEY = "mnr.demoApiBaseUrl";
let cachedApiBaseUrl: string | null | undefined;

/** Chuẩn hóa địa chỉ người dùng nhập về origin, không kèm đường dẫn API. */
export function normalizeDemoApiBaseUrl(rawValue: string): string {
  let candidate = rawValue.trim();

  if (candidate.length === 0) {
    throw new Error("Please enter the laptop API address.");
  }

  if (!/^https?:\/\//i.test(candidate)) {
    candidate = "http://" + candidate;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(candidate);
  } catch (cause) {
    throw new Error("Please enter a valid API address.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("The API address must use HTTP or HTTPS.");
  }

  if (parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
    throw new Error("The API address must not contain credentials or query parameters.");
  }

  return parsedUrl.origin;
}

/** Đọc địa chỉ đã lưu; cache tránh đọc storage ở mọi request. */
export async function getSavedDemoApiBaseUrl(): Promise<string | null> {
  if (cachedApiBaseUrl !== undefined) {
    return cachedApiBaseUrl;
  }

  cachedApiBaseUrl = await AsyncStorage.getItem(DEMO_API_BASE_URL_KEY);
  return cachedApiBaseUrl;
}

/** Lưu địa chỉ đã chuẩn hóa để vẫn còn sau khi mở lại ứng dụng. */
export async function saveDemoApiBaseUrl(rawValue: string): Promise<string> {
  const normalizedUrl = normalizeDemoApiBaseUrl(rawValue);
  await AsyncStorage.setItem(DEMO_API_BASE_URL_KEY, normalizedUrl);
  cachedApiBaseUrl = normalizedUrl;
  return normalizedUrl;
}
