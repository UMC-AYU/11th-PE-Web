import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberRatings } from "@/api/members/get-member-ratings";
import { createRating } from "@/api/ratings/create-rating";
import { deleteRating } from "@/api/ratings/delete-rating";
import { updateRating } from "@/api/ratings/update-rating";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/jwt";

// 로그인한 회원의 ID (토큰 payload의 sub)
export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

export const myRatingsQueryKey = (memberId: number | null) =>
  ["members", memberId, "ratings"] as const;

// 내가 남긴 평점 목록: GET /members/{memberId}/ratings
export function useMyRatings() {
  const memberId = useMyMemberId();

  return useQuery({
    queryKey: myRatingsQueryKey(memberId),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null, // 로그인했을 때만 조회해요.
  });
}

// 평점 등록·수정·삭제: 성공하면 내 평점 목록을 stale로 바꿔서 다시 조회해요.
// 그래서 영화 상세의 내 평점과 내 정보의 평점 목록이 함께 최신 상태가 돼요.
export function useRatingMutations() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: myRatingsQueryKey(memberId) });

  return {
    create: useMutation({ mutationFn: createRating, onSuccess }),
    update: useMutation({ mutationFn: updateRating, onSuccess }),
    remove: useMutation({ mutationFn: deleteRating, onSuccess }),
  };
}
