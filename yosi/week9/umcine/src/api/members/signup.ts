import { requestApi } from "@/api/api-client";
import type { SignupRequest, SignupResult } from "./models";

// 회원가입: 성공하면 { isSuccess, code: "COMMON201", message, result } 응답 전체를 돌려줘요.
// 화면에서 서버가 보낸 message("회원가입에 성공했습니다.")를 그대로 보여주려고 result만 꺼내지 않아요.
export function signup(body: SignupRequest) {
  return requestApi<SignupResult>("members", { method: "post", json: body });
}
