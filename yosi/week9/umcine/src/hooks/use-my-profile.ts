import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

// 내 정보 조회: 헤더와 같은 query key를 써서 캐시를 함께 써요.
export function useMyProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken), // 토큰이 있을 때만 조회해요.
    staleTime: 5 * 60 * 1000, // 내 정보는 자주 바뀌지 않아서 5분 동안 fresh로 둬요.
    retry: false,
  });
}

// 내 정보 수정: 성공하면 서버가 돌려준 최신 내 정보로 캐시를 바로 바꿔요.
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (me) => {
      // 헤더의 닉네임과 내 정보 화면이 다시 요청하지 않고 바로 바뀌어요.
      queryClient.setQueryData(["members", "me"], me);
    },
  });
}
