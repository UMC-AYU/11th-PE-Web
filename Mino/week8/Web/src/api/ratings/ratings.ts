import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";
import { apiClient } from "../api-client";
import { unwrapResponse, type ApiResponse } from "../api-response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingInput { score: number; comment: string }
type RatingChange =
  | { action: "create"; body: RatingInput }
  | { action: "update"; ratingId: number; body: RatingInput }
  | { action: "delete"; ratingId: number };

export const ratingKeys = {
  list: (memberId: number | null) => ["ratings", memberId] as const,
  change: (memberId: number | null, movieId: number) => ["ratings", memberId, "change", movieId] as const,
};

export function ratingsQueryOptions(memberId: number | null) {
  return queryOptions({
    queryKey: ratingKeys.list(memberId),
    queryFn: ({ signal }) => apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>(),
    enabled: memberId !== null,
    retry: false,
  });
}

export function ratingMutationOptions(memberId: number | null, movieId: number) {
  return mutationOptions({
    mutationKey: ratingKeys.change(memberId, movieId),
    scope: { id: `rating-${memberId}-${movieId}` },
    mutationFn: async (change: RatingChange): Promise<void> => {
      if (change.action === "delete") {
        unwrapResponse(await authApi.delete(`ratings/${change.ratingId}`).json<ApiResponse<null>>());
        return;
      }
      const response = change.action === "create"
        ? await authApi.post("ratings", { json: { movieId, ...change.body } }).json<ApiResponse<Rating>>()
        : await authApi.patch(`ratings/${change.ratingId}`, { json: change.body }).json<ApiResponse<Rating>>();
      unwrapResponse(response);
    },
  });
}
