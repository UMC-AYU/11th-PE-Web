import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/api/members/login";
import { useAuthStore } from "@/stores/auth-store";

export function useLoginMutation() {
  // QueryClientProvider에 연결된 QueryClient를 가져와요.
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // 1. 토큰을 먼저 저장해야 다시 조회할 때 새 토큰이 붙어요.
      setAccessToken(response.result.accessToken);

      // 2. 내 정보 캐시를 stale로 바꿔요.
      //    헤더처럼 지금 내 정보를 쓰는 화면이 있으면 바로 다시 요청해요.
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });

      // 3. 홈으로 이동해요.
      router.push("/");
    },
  });
}
