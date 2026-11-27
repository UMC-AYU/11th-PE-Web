import { requestApi } from "@/api/api-client";
import type { LoginRequest, LoginResult } from "./models";

// 로그인: 성공하면 result에 nickname과 accessToken이 들어 있어요.
export function login(body: LoginRequest) {
  return requestApi<LoginResult>("auth/login", { method: "post", json: body });
}
