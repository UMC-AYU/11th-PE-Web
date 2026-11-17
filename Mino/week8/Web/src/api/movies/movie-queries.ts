import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

const movieQueryKeys = {
  all: ["movies"] as const,
  popular: (page: number) =>
    [...movieQueryKeys.all, "popular", { page }] as const,
  search: (query: string, page: number) =>
    [...movieQueryKeys.all, "search", { query, page }] as const,
  detail: (movieId: number) =>
    [...movieQueryKeys.all, "detail", movieId] as const,
};

function popularMoviesQueryOptions(page: number) {
  return queryOptions({
    queryKey: movieQueryKeys.popular(page),
    queryFn: ({ signal }) => getMovies({ page, signal }),
  });
}

function searchMoviesQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: movieQueryKeys.search(query, page),
    queryFn: ({ signal }) => searchMovies({ query, page, signal }),
    enabled: query.length > 0,
  });
}

function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: movieQueryKeys.detail(movieId),
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    enabled: Number.isInteger(movieId) && movieId > 0,
  });
}

export {
  movieDetailQueryOptions,
  movieQueryKeys,
  popularMoviesQueryOptions,
  searchMoviesQueryOptions,
};
