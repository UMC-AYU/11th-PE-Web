import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import {
  getMovieDetail,
  isTmdbConfigured,
  posterUrl,
  type TmdbMovieDetail,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";
import {
  formatMovieRuntime,
  getMovieDetailErrorMessage,
} from "../../utils/movie-detail";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return <main className="p-12 text-white">올바르지 않은 영화 번호예요.</main>;
  }

  if (!isTmdbConfigured) {
    return <main className="p-12 text-white">TMDB 설정이 필요해요. .env.local에 VITE_TMDB_ACCESS_TOKEN을 설정하고 개발 서버를 다시 시작해 주세요.</main>;
  }

  return <MovieDetailView key={id} movieId={id} />;
}

function MovieDetailView({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getMovieDetail(movieId)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
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

  if (errorMessage || !movie) {
    return <main className="p-12 text-white">{errorMessage ?? "영화 정보를 불러오지 못했어요."}</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 text-white">
      <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-zinc-800">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={`${movie.title} 배경`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
          {movie.poster_path ? (
            <img
              src={posterUrl(movie.poster_path)}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              이미지 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
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
            {movie.runtime === null
              ? formatMovieRuntime(movie.runtime)
              : `상영 시간: ${formatMovieRuntime(movie.runtime)}`}
          </p>

          {movie.tagline && (
            <p className="mt-6 text-lg font-semibold text-zinc-300">{movie.tagline}</p>
          )}

          <p className="mt-8 leading-8 text-zinc-300">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
        </div>
      </div>
    </main>
  );
}
