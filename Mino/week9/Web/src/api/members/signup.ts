import { apiClient } from "../api-client";
import { unwrapResponse } from "../api-response";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { memberId: number; email: string; nickname: string };
}

export async function signup(body: SignupRequest) {
  const response = await apiClient.post("members", { json: body }).json<SignupResponse>();
  unwrapResponse(response);
  return response;
}
