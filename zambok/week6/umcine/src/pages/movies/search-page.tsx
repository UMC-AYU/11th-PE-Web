import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  searchMovies,
  posterUrl,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const initialQuery =
    new URLSearchParams(window.location.search).get("query")?.trim() ?? "";

  const [input, setInput] = useState(initialQuery);

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: initialQuery }],
    queryFn: () => searchMovies(initialQuery),
    enabled: initialQuery.length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const movies = searchQuery.data?.results ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = input.trim();

    if (!query) {
      window.location.assign("/search");
      return;
    }

    window.location.assign(
      `/search?query=${encodeURIComponent(query)}`
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <h1 className="mb-8 text-4xl font-bold">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex gap-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="영화 제목을 입력하세요."
          className="min-w-0 flex-1 rounded-lg border border-gray-500 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
        >
          검색
        </button>
      </form>

      {!initialQuery ? (
        <p className="text-gray-400">
          검색어를 입력해 주세요.
        </p>
      ) : searchQuery.isLoading ? (
        <p className="text-gray-400">
          검색 결과를 불러오는 중이에요.
        </p>
      ) : searchQuery.isError ? (
        <div>
          <p className="mb-4 text-red-400">
            영화 검색 중 오류가 발생했어요.
          </p>

          <button
            type="button"
            onClick={() => void searchQuery.refetch()}
            className="rounded bg-blue-600 px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : searchQuery.isSuccess && movies.length === 0 ? (
        <p className="text-gray-400">
          '{initialQuery}'에 대한 검색 결과가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="relative flex gap-5 rounded-xl bg-zinc-900 p-4"
            >
              <Link
                to="/movies/$movieId"
                params={{
                  movieId: String(movie.id),
                }}
                className="shrink-0"
              >
                {movie.poster_path ? (
                  <img
                    src={posterUrl(movie.poster_path)}
                    alt={`${movie.title} 포스터`}
                    className="h-36 w-24 rounded-lg object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-36 w-24 items-center justify-center rounded-lg bg-gray-800 text-xs text-gray-400">
                    포스터 없음
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1 pr-10">
                <h2 className="mb-3 text-xl font-bold">
                  {movie.title}
                </h2>

                <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>

                <Link
                  to="/movies/$movieId"
                  params={{
                    movieId: String(movie.id),
                  }}
                  className="text-sm text-blue-400 hover:underline"
                >
                  상세 보기 →
                </Link>
              </div>

              <div className="absolute right-4 top-4">
                <BookmarkButton movieId={movie.id} />
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="mt-12 text-xs text-gray-500">
        영화 정보 제공: TMDB (The Movie Database).
        이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.
      </footer>
    </main>
  );
}