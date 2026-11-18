import ky, { HTTPError } from "ky";

const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

export const apiClient = ky.create({
    prefix: baseUrl || "/api",
    timeout: 15000,
    retry: { limit: 0 },
});

export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
    if (error instanceof HTTPError) {
        if (error.response.status === 401) return "로그인이 만료됐어요. 다시 로그인해 주세요.";
        if (error.response.status === 403) return "이 작업을 수행할 권한이 없어요.";
    }
    return fallback;
}
