import { authApi } from "./auth-api";
import type { ApiResponse } from "./api-client";
import { HTTPError } from "ky";

interface FavoriteRecord {
    movieId?: number;
    id?: number;
    movie?: { id?: number; movieId?: number };
}

type FavoriteListResult = FavoriteRecord[] | { favorites?: FavoriteRecord[]; content?: FavoriteRecord[] };
type FavoriteDetailResult = boolean | { isFavorite?: boolean; favorite?: boolean; movieId?: number } | null;

export async function getFavorites(): Promise<number[]> {
    const response = await authApi.get("favorites").json<ApiResponse<FavoriteListResult> | FavoriteRecord[]>();
    const result = Array.isArray(response) ? response : response.result;
    const items = Array.isArray(result) ? result : result.favorites ?? result.content ?? [];
    return items.map((item) => item.movieId ?? item.movie?.movieId ?? item.movie?.id ?? item.id)
        .filter((id): id is number => typeof id === "number" && Number.isSafeInteger(id));
}

export async function getFavorite(movieId: number): Promise<boolean> {
    try {
        const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<FavoriteDetailResult> | FavoriteDetailResult>();
        const result = response && typeof response === "object" && "result" in response ? response.result : response;
        if (typeof result === "boolean") return result;
        if (!result) return false;
        return result.isFavorite ?? result.favorite ?? result.movieId === movieId;
    } catch (error) {
        if (error instanceof HTTPError && error.response.status === 404) return false;
        throw error;
    }
}

export function addFavorite(movieId: number) {
    return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<unknown>>();
}

export async function deleteFavorite(movieId: number) {
    await authApi.delete(`favorites/${movieId}`);
}
