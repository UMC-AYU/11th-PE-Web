import { TMDB_LANGUAGE, tmdbClient } from "../tmdb-client";
import type { GetMoviesParams, TmdbMovieListItem, TmdbPaginatedResponse } from "./models";

export function getMovies({ page = 1 }: GetMoviesParams = {}) {
  return tmdbClient
    .get("movie/popular", { searchParams: { language: TMDB_LANGUAGE, page } })
    .json<TmdbPaginatedResponse<TmdbMovieListItem>>();
}
