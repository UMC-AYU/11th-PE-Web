import { queryOptions } from "@tanstack/react-query";
import { getMemberId } from "../../stores/auth-store";
import { authApi } from "../auth-api";
import { unwrapResponse, type ApiResponse } from "../api-response";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(signal?: AbortSignal) {
  return unwrapResponse(await authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>());
}

export async function updateMe(body: { nickname: string }) {
  return unwrapResponse(await authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>());
}

export function meQueryOptions(accessToken: string | null) {
  return queryOptions({
    queryKey: ["members", "me", getMemberId(accessToken)] as const,
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
