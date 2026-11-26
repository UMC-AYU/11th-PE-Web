import { authApi } from "../auth-api";

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export async function createRating(body: CreateRatingRequest) {
  await authApi.post("ratings", { json: body });
}