import { request } from "@/api/api-client";
import type { MemberRatings } from "./models";

export function getMemberRatings(memberId: number) {
  return request<MemberRatings>(`members/${memberId}/ratings`);
}
