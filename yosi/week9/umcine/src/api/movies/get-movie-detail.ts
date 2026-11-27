import { TMDB_LANGUAGE, tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

export function getMovieDetail(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, { searchParams: { language: TMDB_LANGUAGE } })
    .json<TmdbMovieDetail>();
}
