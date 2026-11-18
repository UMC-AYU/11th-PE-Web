import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(token: string, signal: AbortSignal): Promise<MemberInfo> {
  const response = await authApi(token)
    .get("members/me", { signal })
    .json<ApiResponse<MemberInfo>>();

  return response.result;
}

export async function updateMe(token: string, nickname: string): Promise<MemberInfo> {
  const response = await authApi(token)
    .patch("members/me", { json: { nickname } })
    .json<ApiResponse<MemberInfo>>();

  return response.result;
}
