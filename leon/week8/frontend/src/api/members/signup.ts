import { apiClient, type ApiResponse } from "../api-client";

export interface SignupRequest {
    email: string;
    nickname: string;
    password: string;
}

export function signup(body: SignupRequest) {
    return apiClient.post("members", { json: body }).json<ApiResponse<{ memberId: number; email: string; nickname: string }>>();
}
