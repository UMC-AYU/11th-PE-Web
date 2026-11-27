"use client";

import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { movieKeys } from "../../api/movies/query-keys";
import { StatusMessage } from "../../components/common/status-message";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { MyRatingPanel } from "../../components/movies/my-rating-panel";
import { formatDate, formatRuntime } from "../../utils/format";
import { getTmdbImageUrl } from "../../utils/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const id = Number(movieId);
  // /movies/abc처럼 잘못된 주소로 직접 접근하면 요청하지 않아요.
  const isValidId = Number.isInteger(id) && id > 0;

  const movieQuery = useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => getMovieDetail(id),
    enabled: isValidId,
    // 상세 데이터는 30초 동안 fresh 상태로 유지되고, 그 뒤에 stale로 바뀌어요.
    staleTime: 1000 * 30,
  });

  if (isValidId && movieQuery.isPending) {
    return (
      <main>
        <StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  const movie = movieQuery.data;

  if (!isValidId || movieQuery.isError || !movie) {
    const isNotFound =
      !isValidId ||
      (movieQuery.error instanceof HTTPError && movieQuery.error.response.status === 404);
    return (
      <main>
        <StatusMessage tone="error">
          {isNotFound ? "영화를 찾을 수 없어요." : "영화 정보를 불러오지 못했어요."}
        </StatusMessage>
      </main>
    );
  }

  const meta = [
    movie.release_date && formatDate(movie.release_date),
    movie.genres.map((genre) => genre.name).join(" · "),
    movie.runtime && formatRuntime(movie.runtime),
  ].filter(Boolean);

  return (
    <main>
      <section className="relative h-[420px] overflow-hidden bg-gray-900 text-white">
        <img
          src={getTmdbImageUrl(movie.backdrop_path, "w1280")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col px-6 py-6">
          <Link href="/" className="flex w-fit items-center gap-1 text-xs font-semibold">
            <img src="/icons/chevron-left.svg" alt="" aria-hidden="true" className="size-5 invert" />
            영화 목록
          </Link>
          <div className="mt-auto pb-6">
            <h1 className="text-5xl font-extrabold">{movie.title}</h1>
            <p className="mt-3 text-sm text-gray-200">{movie.original_title}</p>
            <p className="mt-3 text-sm font-semibold">
              {meta.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_280px]">
        <section className="flex gap-8">
          <img
            src={getTmdbImageUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-40 shrink-0 rounded-[10px] bg-gray-200 object-cover shadow-md"
          />
          <div>
            {movie.tagline && <h2 className="text-lg font-bold">{movie.tagline}</h2>}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {movie.overview || "등록된 줄거리가 없어요."}
            </p>
            {/* 찜하기: 찜 여부 조회(GET) + 찜하기(POST) / 찜 해제(DELETE) */}
            <FavoriteButton movieId={movie.id} />
          </div>
        </section>

        {/* 내 평점: 로그인했으면 등록·수정·삭제 API와 연결돼요. */}
        <MyRatingPanel movieId={movie.id} />
      </div>
    </main>
  );
}
