import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useProfileStore } from "../../stores/profile-store";

const PAGE_SIZE = 5;

export function ProfilePage() {
  const { nickname, email, imageUrl } = useProfileStore();
  const [requestedPage, setRequestedPage] = useState(1);

  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    retry: false,
  });

  const bookmarkedMovieIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const totalPages = Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleIds = bookmarkedMovieIds.slice(startIndex, startIndex + PAGE_SIZE);

  const movieQueries = useQueries({
    queries: visibleIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });

  const movies = movieQueries.flatMap(({ data }) =>
    data
      ? [{ ...data, genre_ids: data.genres.map((genre) => genre.id) }]
      : [],
  );

  const isLoading =
    favoritesQuery.isLoading || movieQueries.some((query) => query.isPending);
  const hasMovieError = movieQueries.some((query) => query.isError);

  return (
    <main className="min-h-[calc(100dvh-72px)] bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6">
        <div className="flex items-center justify-between gap-4 pb-5">
          <h1 className="text-2xl font-bold tracking-tight">내 정보</h1>

          <Link
            to="/profile/edit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            정보 수정
          </Link>
        </div>

        <section className="border-y border-gray-200 py-4">
          <h2 className="mb-3 text-sm font-semibold">기본 정보</h2>

          <div className="flex flex-wrap items-center gap-5">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-gray-200">
              <img
                src={imageUrl ?? "/icons/movie-icons/person.svg"}
                alt=""
                className={
                  imageUrl ? "size-full rounded-full object-cover" : "size-8"
                }
              />
            </div>

            <dl className="grid min-w-0 flex-1 gap-4 sm:grid-cols-[1fr_2fr]">
              <div>
                <dt className="text-xs text-gray-500">닉네임</dt>
                <dd className="mt-1 text-sm font-semibold">{nickname}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-gray-500">이메일</dt>
                <dd className="mt-1 break-all text-sm font-semibold">{email}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="pt-5">
          <h2 className="mb-3 text-sm font-semibold">내 즐겨찾기</h2>

          {favoritesQuery.isSuccess && bookmarkedMovieIds.length === 0 && (
            <p className="text-sm text-gray-600">
              등록한 즐겨찾기가 없어요.
            </p>
          )}

          {isLoading && (
            <p role="status" className="mb-3 text-sm text-gray-600">
              즐겨찾기 영화를 불러오는 중이에요.
            </p>
          )}

          {favoritesQuery.isError && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              즐겨찾기 목록을 불러오지 못했어요.
            </p>
          )}

          {hasMovieError && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              일부 영화 정보를 불러오지 못했어요.
            </p>
          )}

          {movies.length > 0 && <MovieGrid movies={movies} />}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setRequestedPage}
          />
        </section>
      </div>
    </main>
  );
}