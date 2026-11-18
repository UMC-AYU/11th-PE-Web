import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export function memberKey(sessionVersion: number) {
  return ["member-session", sessionVersion, "me"] as const;
}

export function useMemberQuery(token: string) {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);

  return useQuery({
    queryKey: memberKey(sessionVersion),
    queryFn: ({ signal }) => getMe(token, signal),
    retry: false,
  });
}
