import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "@/api/favorites/favorites";
import { useMyMemberId } from "@/hooks/use-my-ratings";

// 회원 ID를 key에 넣어서, 다른 계정으로 로그인해도 이전 사람의 찜이 섞이지 않아요.
// ["members", 2, "favorites"]로 시작하는 query를 한 번에 무효화할 수 있게 계층으로 만들어요.
export const favoriteKeys = {
  all: (memberId: number | null) => ["members", memberId, "favorites"] as const,
  list: (memberId: number | null) => [...favoriteKeys.all(memberId), "list"] as const,
  status: (memberId: number | null, movieId: number) =>
    [...favoriteKeys.all(memberId), "status", movieId] as const,
};

// 마이페이지: GET /favorites
export function useMyFavorites() {
  const memberId = useMyMemberId();
  return useQuery({
    queryKey: favoriteKeys.list(memberId),
    queryFn: getFavorites,
    enabled: memberId !== null,
  });
}

// 영화 상세: GET /favorites/{movieId}
export function useFavoriteStatus(movieId: number) {
  const memberId = useMyMemberId();
  return useQuery({
    queryKey: favoriteKeys.status(memberId, movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: memberId !== null,
  });
}

// 영화 상세: 찜하기(POST) / 찜 해제(DELETE)
// 성공하면 찜 여부와 찜 목록을 함께 stale로 바꿔서, 상세 버튼과 마이페이지 목록이 같이 바뀌어요.
export function useToggleFavorite(movieId: number) {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();

  return useMutation({
    // 지금 즐겨찾기 상태면 해제(DELETE), 아니면 등록(POST)해요.
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await removeFavorite(movieId);
      else await addFavorite(movieId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoriteKeys.all(memberId) }),
  });
}
