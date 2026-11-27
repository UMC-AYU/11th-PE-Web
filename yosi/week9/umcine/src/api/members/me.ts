import { request } from "@/api/api-client";
import type { Me, UpdateMeRequest } from "./models";

// 내 정보 조회: 토큰은 api-client가 Authorization 헤더에 자동으로 붙여요.
export function getMe() {
  return request<Me>("members/me");
}

// 내 정보 수정: 지금은 닉네임만 바꿀 수 있어요.
export function updateMe(body: UpdateMeRequest) {
  return request<Me>("members/me", { method: "patch", json: body });
}
