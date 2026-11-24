import { apiClient } from "../api-client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export function getMemberRatings(memberId: string) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}