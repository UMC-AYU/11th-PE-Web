import { apiClient, type ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingInput {
  score: number;
  comment: string;
}

export function getMemberRatings(memberId: number, signal: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(token: string, movieId: number, input: RatingInput) {
  const response = await authApi(token)
    .post("ratings", { json: { ...input, movieId } })
    .json<ApiResponse<Rating>>();
  return response.result;
}

export async function updateRating(token: string, ratingId: number, input: RatingInput) {
  const response = await authApi(token)
    .patch(`ratings/${ratingId}`, { json: input })
    .json<ApiResponse<Rating>>();
  return response.result;
}

export async function deleteRating(token: string, ratingId: number) {
  await authApi(token).delete(`ratings/${ratingId}`, { retry: 0 });
}
