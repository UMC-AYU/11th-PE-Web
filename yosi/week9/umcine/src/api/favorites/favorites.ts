import { request } from "@/api/api-client";

// GET /favorites/{movieId}, DELETE /favorites/{movieId} 응답의 result
export type FavoriteStatus = {
  isFavorite: boolean;
};

// 즐겨찾기 한 개 (POST /favorites 응답, GET /favorites 목록의 원소)
export type Favorite = {
  favoriteId: number;
  movieId: number;
  createdAt: string;
};

// 마이페이지: 내 즐겨찾기 목록 (최근 등록 순 배열)
export function getFavorites() {
  return request<Favorite[]>("favorites");
}

// 영화 상세: 이 영화를 즐겨찾기했는지
export function getFavoriteStatus(movieId: number) {
  return request<FavoriteStatus>(`favorites/${movieId}`);
}

// 영화 상세: 즐겨찾기 등록 → 201
export function addFavorite(movieId: number) {
  return request<Favorite>("favorites", { method: "post", json: { movieId } });
}

// 영화 상세: 즐겨찾기 해제 → 200, result: null
export function removeFavorite(movieId: number) {
  return request<null>(`favorites/${movieId}`, { method: "delete" });
}
