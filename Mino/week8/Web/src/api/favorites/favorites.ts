import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";
import { unwrapResponse, type ApiResponse } from "../api-response";

export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
interface FavoriteStatus { isFavorite: boolean }

export const favoriteKeys = {
  list: (memberId: number | null) => ["favorites", memberId, "list"] as const,
  status: (memberId: number | null, movieId: number) => ["favorites", memberId, "status", movieId] as const,
  change: (memberId: number | null, movieId: number) => ["favorites", memberId, "change", movieId] as const,
};

export function favoritesQueryOptions(memberId: number | null) {
  return queryOptions({
    queryKey: favoriteKeys.list(memberId),
    queryFn: async ({ signal }) => unwrapResponse(await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>()),
    enabled: memberId !== null,
    retry: false,
  });
}

export function favoriteStatusQueryOptions(memberId: number | null, movieId: number) {
  return queryOptions({
    queryKey: favoriteKeys.status(memberId, movieId),
    queryFn: async ({ signal }) => unwrapResponse(await authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<FavoriteStatus>>()),
    enabled: memberId !== null && Number.isSafeInteger(movieId) && movieId > 0,
    retry: false,
  });
}

export function favoriteMutationOptions(memberId: number | null, movieId: number) {
  return mutationOptions({
    mutationKey: favoriteKeys.change(memberId, movieId),
    scope: { id: `favorite-${memberId}-${movieId}` },
    mutationFn: async (isFavorite: boolean) => {
      const response = isFavorite
        ? await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>()
        : await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
      unwrapResponse(response);
      return isFavorite;
    },
  });
}
