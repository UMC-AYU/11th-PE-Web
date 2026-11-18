import { authApi } from "./auth-api";
import type { ApiResponse } from "./api-client";

export interface Rating {
    ratingId: number;
    movieId: number;
    score: number;
    review: string | null;
}

export interface RatingInput {
    movieId: number;
    score: number;
    review: string;
}

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
    const response = await authApi.get(`members/${memberId}/ratings`).json<Rating[] | ApiResponse<Rating[]>>();
    return Array.isArray(response) ? response : response.result;
}

export function createRating(input: RatingInput) {
    return authApi.post("ratings", { json: input }).json<ApiResponse<Rating>>();
}

export function updateRating(ratingId: number, input: Pick<RatingInput, "score" | "review">) {
    return authApi.patch(`ratings/${ratingId}`, { json: input }).json<ApiResponse<Rating>>();
}

export async function deleteRating(ratingId: number) {
    await authApi.delete(`ratings/${ratingId}`);
}
