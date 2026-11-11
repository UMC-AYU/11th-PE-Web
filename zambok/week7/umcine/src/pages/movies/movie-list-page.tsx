import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  getPopularMovies,
  posterUrl,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["movies", "popular", { page }],
    queryFn: () => getPopularMovies(page),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, 500);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">인기 영화</h1>

        {isFetching && !isPending && (
          <span className="text-sm text-gray-400">
            최신 영화 정보를 확인하는 중...
          </span>
        )}
      </div>

      {isPending ? (
        <p className="py-12 text-gray-400">
          영화를 불러오는 중이에요.
        </p>
      ) : isError ? (
        <div className="py-12">
          <p className="mb-4 text-red-400">
            영화 목록을 불러오지 못했어요.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-500"
          >
            다시 시도
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p className="py-12 text-gray-400">
          표시할 영화가 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <article key={movie.id} className="min-w-0">
                <div className="relative">
                  <Link
                    to="/movies/$movieId"
                    params={{
                      movieId: String(movie.id),
                    }}
                    className="block"
                  >
                    {movie.poster_path ? (
                      <img
                        src={posterUrl(movie.poster_path)}
                        alt={`${movie.title} 포스터`}
                        className="aspect-[2/3] w-full rounded-xl object-cover transition-opacity hover:opacity-80"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-gray-800 text-gray-400">
                        포스터 없음
                      </div>
                    )}
                  </Link>

                  <div className="absolute right-2 top-2">
                    <BookmarkButton movieId={movie.id} />
                  </div>
                </div>

                <Link
                  to="/movies/$movieId"
                  params={{
                    movieId: String(movie.id),
                  }}
                  className="mt-3 block truncate font-semibold hover:text-blue-400"
                >
                  {movie.title}
                </Link>

                <p className="mt-2 text-sm text-gray-400">
                  {movie.release_date || "개봉일 정보 없음"}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-5">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-lg bg-gray-800 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>

            <span className="text-gray-300">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-lg bg-gray-800 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </>
      )}

      <footer className="mt-12 text-xs text-gray-500">
        영화 정보 제공: TMDB (The Movie Database).
        이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.
      </footer>
    </main>
  );
}