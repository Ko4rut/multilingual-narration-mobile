/** HTTP client dùng chung; base URL được cấu hình qua Expo public environment. */
export class ApiHttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
  }
}

export async function apiGet<T>(
  path: string,
  options: { signal?: AbortSignal } = {},
): Promise<T> {
  // Kiểm tra khi gọi API thay vì tại thời điểm import để app vẫn mở được màn hình lỗi.
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("Thiếu EXPO_PUBLIC_API_BASE_URL trong cấu hình Mobile.");
  }

  const response = await fetch(`${baseUrl}${path}`, { signal: options.signal });
  if (!response.ok) {
    throw new ApiHttpError(response.status, `API trả về lỗi HTTP ${response.status}.`);
  }
  return (await response.json()) as T;
}
