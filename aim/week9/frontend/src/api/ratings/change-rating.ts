import { authApi } from "../auth-api";

interface UpdateRatingRequest {
  score: number;
  comment: string | null;
}

export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
) {
  await authApi.patch(`ratings/${ratingId}`, { json: body });
}

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}