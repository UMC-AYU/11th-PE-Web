// 영화 관련 query key를 한곳에서 관리해요.
// 목록·검색·상세가 서로 다른 key를 쓰기 때문에 각각 따로 캐시돼요.
export const movieKeys = {
  all: ["movies"] as const,
  list: (page: number) => [...movieKeys.all, "list", { page }] as const,
  search: (query: string, page: number) => [...movieKeys.all, "search", { query, page }] as const,
  detail: (movieId: number) => [...movieKeys.all, "detail", movieId] as const,
};
