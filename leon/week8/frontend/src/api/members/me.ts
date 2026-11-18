import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-client";
import { memberIdFromToken, useAuthStore } from "../../stores/auth-store";

export interface MemberInfo {
    id?: number;
    memberId?: number;
    email: string;
    nickname: string;
    createdAt: string;
}

export async function getMe(): Promise<MemberInfo> {
    const response = await authApi.get("members/me").json<ApiResponse<MemberInfo>>();
    return response.result;
}

export function getMemberId(me?: MemberInfo) {
    const { memberId, accessToken } = useAuthStore.getState();
    return me?.memberId ?? me?.id ?? memberId ?? (accessToken ? memberIdFromToken(accessToken) : null);
}
