import { TMDB_LANGUAGE, tmdbClient } from "../tmdb-client";
import type { SearchMoviesParams, TmdbMovieListItem, TmdbPaginatedResponse } from "./models";

export function searchMovies({ query, page = 1 }: SearchMoviesParams) {
  return tmdbClient
    .get("search/movie", { searchParams: { language: TMDB_LANGUAGE, query, page } })
    .json<TmdbPaginatedResponse<TmdbMovieListItem>>();
}
