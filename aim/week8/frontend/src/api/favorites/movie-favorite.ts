import { authApi } from "../auth-api";

interface FavoriteStatusResponse {
  result: {
    isFavorite: boolean;
  };
}

export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteStatusResponse>();

  return response.result.isFavorite;
}

export async function addFavorite(movieId: number) {
  await authApi.post("favorites", { json: { movieId } });
}

export async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}