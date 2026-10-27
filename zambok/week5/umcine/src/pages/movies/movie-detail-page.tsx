import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import {
  getMovieDetail,
  posterUrl,
  type TmdbMovieDetail,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const id = Number(movieId);

    if (!Number.isSafeInteger(id) || id <= 0) {
      setMovie(null);
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setMovie(null);

    getMovieDetail(id)
      .then((data) => {
        if (!ignore) setMovie(data);
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
  }, [movieId]);

  if (loading) {
    return <main className="p-12 text-white">영화 정보를 불러오는 중이에요.</main>;
  }

  if (error || !movie) {
    return <main className="p-12 text-white">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 text-white">
      <div className="flex flex-col gap-8 md:flex-row">
        {movie.poster_path && (
          <img
            src={posterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            className="w-64 rounded-xl object-cover"
          />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <BookmarkButton movieId={movie.id} />
          </div>

          <p className="mt-3 text-zinc-400">{movie.original_title}</p>
          <p className="mt-3">{movie.release_date}</p>

          <p className="mt-3">
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>

          <p className="mt-3">
            상영 시간: {movie.runtime ?? "정보 없음"}분
          </p>

          <p className="mt-8 leading-8 text-zinc-300">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
        </div>
      </div>

      <p className="mt-12 text-xs text-zinc-500">
        영화 정보 제공: TMDB (The Movie Database).
        이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.
      </p>
    </main>
  );
}