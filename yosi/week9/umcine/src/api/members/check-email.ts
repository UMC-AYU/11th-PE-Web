import { request } from "@/api/api-client";
import type { EmailAvailability } from "./models";

// 이메일 중복 확인: available이 true면 사용할 수 있어요.
export function checkEmail(email: string) {
  return request<EmailAvailability>(`members/email/${encodeURIComponent(email)}`);
}
