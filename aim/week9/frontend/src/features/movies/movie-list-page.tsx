"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 0,
    500,
  );

  const handlePageChange = (nextPage: number) => {
    if (
      !Number.isInteger(nextPage) ||
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f5f6f8]">
      <div className="mx-auto w-full max-w-[1000px] px-5 pb-16 pt-7 sm:px-10 sm:pb-24 sm:pt-10">
        <h1 className="mb-[22px] text-[32px] font-extrabold leading-[1.2] text-[#111827]">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p role="status">영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}