import { request } from "@/api/api-client";
import type { NicknameAvailability } from "./models";

// 닉네임 중복 확인: available이 true면 사용할 수 있어요.
export function checkNickname(nickname: string) {
  return request<NicknameAvailability>(`members/nickname/${encodeURIComponent(nickname)}`);
}
