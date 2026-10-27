import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  searchMovies,
  posterUrl,
  type TmdbMovie,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [input, setInput] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInput(query ?? "");
  }, [query]);

  useEffect(() => {
    let ignore = false;

    if (!query?.trim()) {
      setMovies([]);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setMovies([]);

    searchMovies(query)
      .then((data) => {
        if (!ignore) setMovies(data.results);
      })
      .catch(() => {
        if (!ignore) setError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      search: input.trim() ? { query: input.trim() } : {},
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <h1 className="mb-8 text-4xl font-bold">영화 검색</h1>

      <form onSubmit={submit} className="mb-8 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="영화 제목 검색"
          className="flex-1 rounded-lg bg-zinc-800 p-3 text-white"
        />
        <button className="rounded-lg bg-blue-600 px-6 py-3">
          검색
        </button>
      </form>

      {!query?.trim() ? (
        <p>검색어를 입력해 주세요.</p>
      ) : loading ? (
        <p>검색 중이에요.</p>
      ) : error ? (
        <p>검색 결과를 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <div className="space-y-4">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="relative flex gap-5 rounded-xl bg-zinc-900 p-4"
            >
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
              >
                {movie.poster_path ? (
                  <img
                    src={posterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="h-36 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-36 w-24 items-center justify-center bg-zinc-800">
                    이미지 없음
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1 pr-12">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="mt-3 inline-block text-blue-400"
                >
                  상세 보기 →
                </Link>
              </div>

              <BookmarkButton
                movieId={movie.id}
                className="absolute right-4 top-4"
              />
            </article>
          ))}
        </div>
      )}

      <p className="mt-12 text-xs text-zinc-500">
        영화 정보 제공: TMDB (The Movie Database).
        이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.
      </p>
    </main>
  );
}