"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "../../api/members/me";
import { favoritesQueryOptions } from "../../api/favorites/favorites";
import { movieDetailQueryOptions } from "../../api/movies/movie-queries";
import { adaptTmdbMovieDetail } from "../../api/movies/movie-adapter";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
import { RequestError, RequestLoading } from "../../components/movies/request-state";
import { MovieCard } from "../../components/movies/movie-card";
import { getApiErrorMessage } from "../../api/api-response";
import { primaryButtonClass } from "../../components/account/account-styles";

export function ProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const meQuery = useQuery(meQueryOptions(accessToken));
  const favoritesQuery = useQuery(favoritesQueryOptions(memberId));

  if (meQuery.isPending) return <RequestLoading label="내 정보를 불러오는 중이에요." />;
  if (meQuery.isError) return <RequestError title="내 정보를 불러오지 못했어요." message={getApiErrorMessage(meQuery.error)} onRetry={() => void meQuery.refetch()} />;
  const { email, nickname } = meQuery.data;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-10">
      <section className="max-w-[416px]" aria-labelledby="profile-title">
        <h1 id="profile-title" className="mb-5 text-3xl font-extrabold">내 정보</h1>
        <dl className="mb-6 divide-y divide-slate-200 rounded-lg border border-slate-300 bg-white px-4">
          <div className="py-3"><dt className="text-xs font-bold text-slate-600">이메일</dt><dd className="mt-1 text-sm font-semibold break-all">{email}</dd></div>
          <div className="py-3"><dt className="text-xs font-bold text-slate-600">닉네임</dt><dd className="mt-1 text-sm font-semibold break-all">{nickname}</dd></div>
        </dl>
        <div className="flex gap-2">
          <Link className={primaryButtonClass} href="/my/edit">내 정보 수정</Link>
          <button className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold" type="button" onClick={() => useAuthStore.getState().setAccessToken(null)}>로그아웃</button>
        </div>
      </section>
      <section className="mt-10" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="mb-5 text-xl font-extrabold">즐겨찾기 영화</h2>
        {memberId === null ? <p role="alert">회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.</p> : favoritesQuery.isPending ? <RequestLoading label="즐겨찾기를 불러오는 중이에요." /> : favoritesQuery.isError ? (
          <RequestError title="즐겨찾기를 불러오지 못했어요." message={getApiErrorMessage(favoritesQuery.error)} onRetry={() => void favoritesQuery.refetch()} />
        ) : favoritesQuery.data.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">아직 즐겨찾기한 영화가 없어요.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {favoritesQuery.data.map((favorite) => <FavoriteMovieCard key={favorite.favoriteId} movieId={favorite.movieId} />)}
          </div>
        )}
      </section>
    </main>
  );
}

function FavoriteMovieCard({ movieId }: { movieId: number }) {
  const detailQuery = useQuery(movieDetailQueryOptions(movieId));
  if (detailQuery.isPending) return <div className="aspect-[2/3] animate-pulse rounded-lg bg-slate-200" role="status" aria-label="영화 정보 조회 중" />;
  if (detailQuery.isError) return (
    <article className="rounded-lg border border-slate-300 bg-white p-4 text-sm">
      <Link className="font-bold text-blue-700" href={`/movies/${movieId}`}>영화 #{movieId}</Link>
      <p className="mt-2 text-slate-600">영화 정보를 불러오지 못했어요.</p>
      <button className="mt-2 underline" type="button" onClick={() => void detailQuery.refetch()}>다시 시도</button>
    </article>
  );
  return <MovieCard movie={adaptTmdbMovieDetail(detailQuery.data)} />;
}

