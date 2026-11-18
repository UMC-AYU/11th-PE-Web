import { apiClient, type ApiResponse } from "../api-client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResult {
    nickname: string;
    accessToken: string;
    memberId?: number;
}

export function login(body: LoginRequest) {
    return apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>();
}
