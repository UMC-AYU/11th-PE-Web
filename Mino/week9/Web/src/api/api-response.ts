import { HTTPError } from "ky";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) throw new Error(response.message);
  return response.result;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  }
  return error instanceof Error ? error.message : "요청에 실패했어요. 다시 시도해 주세요.";
}
