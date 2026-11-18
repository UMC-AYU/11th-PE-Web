import ky, { isHTTPError } from "ky";

export const apiClient = ky.create({
  baseUrl: "http://localhost:3000/",
  timeout: 10000,
});

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (!isHTTPError(error)) return fallback;

  const status = error.response.status;
  if (status >= 500) return fallback;

  const data: unknown = error.data;
  if (typeof data === "object" && data !== null &&
      "message" in data && typeof data.message === "string") {
    return data.message;
  }

  if (status === 401) return "로그인 정보를 확인해 주세요.";
  if (status === 403) return "이 작업을 수행할 권한이 없습니다.";
  if (status === 409) return "이미 등록된 정보입니다.";
  return fallback;
}
