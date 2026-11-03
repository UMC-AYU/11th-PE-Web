import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  getMovieDetail,
  posterUrl,
} from "../../api/tmdb";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isSafeInteger(movieId) && movieId > 0;

  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p>올바르지 않은 영화 번호입니다.</p>
      </main>
    );
  }

  if (movieQuery.isPending) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p>영화 상세 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (movieQuery.isError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12 text-white">
        <p className="mb-4 text-red-400">
          영화 상세 정보를 불러오지 못했어요.
        </p>

        <button
          type="button"
          onClick={() => void movieQuery.refetch()}
          className="rounded bg-blue-600 px-4 py-2"
        >
          다시 시도
        </button>
      </main>
    );
  }

  const movie = movieQuery.data;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-white">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          {movie.poster_path ? (
            <img
              src={posterUrl(movie.poster_path)}
              alt={`${movie.title} 포스터`}
              className="w-64 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-96 w-64 items-center justify-center rounded-xl bg-gray-800 text-gray-400">
              포스터 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-3 text-4xl font-bold">
                {movie.title}
              </h1>

              <p className="text-gray-400">
                {movie.original_title}
              </p>
            </div>

            <BookmarkButton movieId={movie.id} />
          </div>

          <div className="space-y-4">
            <p>
              {movie.release_date || "개봉일 정보 없음"}
            </p>

            <p>
              {movie.genres.length > 0
                ? movie.genres.map((genre) => genre.name).join(", ")
                : "장르 정보 없음"}
            </p>

            <p>
              상영 시간:{" "}
              {movie.runtime
                ? `${movie.runtime}분`
                : "정보 없음"}
            </p>

            {movie.tagline && (
              <p className="italic text-gray-400">
                {movie.tagline}
              </p>
            )}

            <p className="pt-5 leading-8">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-xs text-gray-500">
        영화 정보 제공: TMDB (The Movie Database).
        이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.
      </footer>
    </main>
  );
}