import ky, { HTTPError, type Options } from "ky";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";

// 회원 서버는 성공과 실패를 모두 같은 구조로 응답해요.
// { isSuccess, code, message, result }
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

// 검증 실패(400)일 때 result에 담겨 오는 필드별 오류예요.
export type FieldError = {
  field: string;
  message: string;
};

// 서버가 실패 응답을 보냈을 때 화면에서 쓰기 쉽게 정리한 오류예요.
export class ApiError extends Error {
  status: number;
  code: string;
  result: unknown;

  constructor(status: number, code: string, message: string, result: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.result = result;
  }
}

// 회원 서버 전용 클라이언트예요. 모든 요청 앞에 서버 주소가 붙어요.
export const apiClient = ky.create({
  prefix: env.apiBaseUrl,
  hooks: {
    // 요청을 보내기 직전에 저장된 토큰이 있으면 Authorization 헤더를 붙여요.
    // 그래서 API 함수마다 헤더를 따로 적지 않아도 돼요.
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});

// ky의 실패를 화면에서 쓰기 쉬운 ApiError로 바꿔요.
function toApiError(error: unknown): ApiError {
  if (error instanceof HTTPError) {
    // ky는 실패 응답의 본문을 error.data에 미리 읽어 둬요.
    const body = error.data as Partial<ApiResponse<unknown>> | undefined;
    return new ApiError(
      error.response.status,
      body?.code ?? `HTTP${error.response.status}`,
      body?.message ?? "요청에 실패했어요.",
      body?.result ?? null,
    );
  }
  // 서버가 꺼져 있거나 CORS로 막히면 응답 없이 실패해요.
  return new ApiError(0, "NETWORK_ERROR", "서버에 연결하지 못했어요. 서버가 켜져 있는지 확인해 주세요.");
}

// 요청을 보내고 서버 응답 전체({ isSuccess, code, message, result })를 돌려줘요.
// 실패하면 서버가 보낸 code와 message를 담은 ApiError를 던져요.
export async function requestApi<T>(path: string, options?: Options): Promise<ApiResponse<T>> {
  try {
    return await apiClient(path, options).json<ApiResponse<T>>();
  } catch (error) {
    throw toApiError(error);
  }
}

// 응답에서 result만 필요할 때 써요. (조회 API 대부분)
export async function request<T>(path: string, options?: Options): Promise<T> {
  const body = await requestApi<T>(path, options);
  return body.result;
}

// 204 No Content처럼 응답 본문이 없는 요청에 써요. (예: 삭제)
export async function requestNoContent(path: string, options?: Options): Promise<void> {
  try {
    await apiClient(path, options);
  } catch (error) {
    throw toApiError(error);
  }
}
