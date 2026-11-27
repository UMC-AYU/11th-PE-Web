import { request } from "@/api/api-client";
import type { Rating, UpdateRatingRequest } from "./models";

// 평점 수정: PATCH /ratings/{ratingId} → 200
export function updateRating({ ratingId, ...body }: UpdateRatingRequest & { ratingId: number }) {
  return request<Rating>(`ratings/${ratingId}`, { method: "patch", json: body });
}
