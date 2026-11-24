import { apiClient } from "../api-client";

export function checkMemberAvailability(field: "email" | "nickname", value: string) {
  return apiClient
    .get(`members/${field}/${encodeURIComponent(value)}`)
    .json<{ available: boolean }>();
}
