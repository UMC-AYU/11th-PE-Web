import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  getPopularMovies,
  posterUrl,
  type TmdbMovie,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    getPopularMovies()
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
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-white">
      <h1 className="mb-8 text-4xl font-bold">인기 영화</h1>

      {loading ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : error ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <article key={movie.id} className="relative">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
              >
                {movie.poster_path ? (
                  <img
                    src={posterUrl(movie.poster_path)}
                    alt={`${movie.title} 포스터`}
                    className="aspect-[2/3] w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-zinc-800">
                    포스터 없음
                  </div>
                )}
                <h2 className="mt-3 font-semibold">{movie.title}</h2>
              </Link>

              <BookmarkButton
                movieId={movie.id}
                className="absolute right-2 top-2"
              />

              <p className="mt-1 text-sm text-zinc-400">
                {movie.release_date}
              </p>
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