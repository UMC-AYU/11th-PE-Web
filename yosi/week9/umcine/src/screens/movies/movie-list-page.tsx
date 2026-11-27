"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { movieKeys } from "../../api/movies/query-keys";
import { StatusMessage } from "../../components/common/status-message";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

// TMDB는 500페이지까지만 조회할 수 있어요.
const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: movieKeys.list(page),
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, TMDB_MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">영화 목록</h1>

      {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인해요. */}
      {moviesQuery.isPending ? (
        <MovieGridSkeleton />
      ) : moviesQuery.isError ? (
        <StatusMessage tone="error">{moviesQuery.error.message}</StatusMessage>
      ) : movies.length === 0 ? (
        <StatusMessage>표시할 영화가 없어요.</StatusMessage>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}
