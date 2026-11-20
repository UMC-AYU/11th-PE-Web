import { apiClient } from "../api-client";
import { unwrapResponse, type ApiResponse } from "../api-response";

interface LoginRequest { email: string; password: string }
interface LoginResult { nickname: string; accessToken: string }

export async function login(body: LoginRequest) {
  const response = await apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>();
  return unwrapResponse(response);
}
