import { requestNoContent } from "@/api/api-client";

// 평점 삭제: DELETE /ratings/{ratingId} → 204 (응답 본문 없음)
export function deleteRating(ratingId: number) {
  return requestNoContent(`ratings/${ratingId}`, { method: "delete" });
}
