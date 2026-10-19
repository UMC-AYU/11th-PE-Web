import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number, signal?: AbortSignal) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      signal,
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export { getMovieDetail, type GetMovieDetailResponse };
