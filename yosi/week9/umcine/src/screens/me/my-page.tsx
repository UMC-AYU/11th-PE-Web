"use client";

import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { movieKeys } from "@/api/movies/query-keys";
import { StatusMessage } from "@/components/common/status-message";
import { useMyFavorites } from "@/hooks/use-favorites";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useMyRatings } from "@/hooks/use-my-ratings";
import { formatDate } from "@/utils/format";
import { getTmdbImageUrl } from "@/utils/tmdb-image";

export function MyPage() {
  // 로그인 검사는 (auth) Layout Route가 먼저 해서, 여기서는 조회만 하면 돼요.
  const profileQuery = useMyProfile();

  if (profileQuery.isPending) {
    return (
      <main>
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main>
        <StatusMessage tone="error">{profileQuery.error.message}</StatusMessage>
      </main>
    );
  }

  const me = profileQuery.data;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">내 정보</h1>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex items-center gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <img src="/icons/person.svg" alt="" aria-hidden="true" className="size-10 opacity-50" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-2xl font-bold">{me.nickname}</p>
            <p className="mt-1 truncate text-sm text-gray-500">{me.email}</p>
          </div>
          <Link
            href="/me/edit"
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-50"
          >
            <img src="/icons/edit.svg" alt="" aria-hidden="true" className="size-4" />
            정보 수정
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-sm">
          <div>
            <dt className="text-xs text-gray-400">이메일</dt>
            <dd className="mt-1 font-semibold">{me.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400">가입일</dt>
            <dd className="mt-1 font-semibold">{formatDate(me.createdAt.slice(0, 10))}</dd>
          </div>
        </dl>
      </section>

      <MyFavoriteList />
      <MyRatingList />
    </main>
  );
}

// 내가 남긴 평점 목록: 영화 상세에서 평점을 바꾸면 같은 query가 갱신돼서 여기에도 반영돼요.
function MyRatingList() {
  const myRatingsQuery = useMyRatings();

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-8">
      <h2 className="font-bold">
        내가 남긴 평점
        {myRatingsQuery.isSuccess && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            {myRatingsQuery.data.ratingCount}개
          </span>
        )}
      </h2>

      {myRatingsQuery.isPending ? (
        <p className="mt-4 text-sm text-gray-400">평점을 불러오는 중이에요.</p>
      ) : myRatingsQuery.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          {myRatingsQuery.error.message}
        </p>
      ) : myRatingsQuery.data.ratings.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">아직 남긴 평점이 없어요. 영화 상세에서 평점을 남겨 보세요.</p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100">
          {myRatingsQuery.data.ratings.map((rating) => (
            <li key={rating.ratingId} className="flex items-center gap-4 py-3">
              <span className="w-20 shrink-0 text-sm text-amber-500" aria-label={`${rating.score}점`}>
                {"★".repeat(rating.score)}
                <span className="text-gray-200">{"★".repeat(5 - rating.score)}</span>
              </span>
              <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                {rating.comment ?? <span className="text-gray-400">한줄평 없음</span>}
              </p>
              <Link
                href={`/movies/${rating.movieId}`}
                className="shrink-0 text-xs font-semibold text-blue-600 hover:underline"
              >
                영화 보기
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// 찜한 영화 목록: 서버는 movieId만 주니까 TMDB 상세 정보로 제목과 포스터를 채워요.
// 영화 상세와 같은 query key(movieKeys.detail)를 써서, 이미 본 영화는 캐시를 재사용해요.
function MyFavoriteList() {
  const favoritesQuery = useMyFavorites();
  const favorites = favoritesQuery.data ?? [];

  const movieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: movieKeys.detail(favorite.movieId),
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 1000 * 30,
    })),
  });

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-8">
      <h2 className="font-bold">
        찜한 영화
        {favoritesQuery.isSuccess && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            {favoritesQuery.data.length}개
          </span>
        )}
      </h2>

      {favoritesQuery.isPending ? (
        <p className="mt-4 text-sm text-gray-400">찜한 영화를 불러오는 중이에요.</p>
      ) : favoritesQuery.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          {favoritesQuery.error.message}
        </p>
      ) : favorites.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">아직 찜한 영화가 없어요. 영화 상세에서 찜해 보세요.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
          {favorites.map((favorite, index) => {
            const movie = movieQueries[index]?.data;
            return (
              <li key={favorite.favoriteId}>
                <Link href={`/movies/${favorite.movieId}`}>
                  {movie ? (
                    <img
                      src={getTmdbImageUrl(movie.poster_path)}
                      alt={`${movie.title} 포스터`}
                      loading="lazy"
                      className="aspect-[2/3] w-full rounded-md bg-gray-200 object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-gray-200" />
                  )}
                  <p className="mt-1.5 truncate text-xs font-semibold">
                    {movie?.title ?? `영화 #${favorite.movieId}`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
