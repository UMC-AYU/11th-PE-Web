"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { movieKeys } from "../../api/movies/query-keys";
import { searchMovies } from "../../api/movies/search-movies";
import { StatusMessage } from "../../components/common/status-message";
import { formatDate } from "../../utils/format";
import { getTmdbImageUrl } from "../../utils/tmdb-image";

export function SearchPage() {
  // TanStack Router의 useSearch 대신 Next.js의 useSearchParams로 ?query= 값을 읽어요.
  const query = useSearchParams().get("query") ?? "";
  const router = useRouter();
  const keyword = query.trim();

  const searchQuery = useQuery({
    // 검색어가 key에 들어가서 검색어마다 따로 캐시돼요.
    queryKey: movieKeys.search(keyword, 1),
    queryFn: () => searchMovies({ query: keyword }),
    // 검색어가 없으면 요청하지 않아요.
    enabled: keyword.length > 0,
  });

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();
    // navigate({ search }) 대신 주소 문자열을 직접 만들어 이동해요.
    router.push(nextQuery ? `/search?query=${encodeURIComponent(nextQuery)}` : "/search");
  }

  if (!keyword) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-40">
        <h1 className="mb-8 text-3xl font-bold">어떤 영화를 찾고 있나요?</h1>
        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-900 bg-white py-2 pl-4 pr-2 shadow-sm"
        >
          <img src="/icons/search.svg" alt="" aria-hidden="true" className="size-5 opacity-60" />
          <label htmlFor="search-query" className="sr-only">
            영화 검색
          </label>
          <input
            id="search-query"
            name="query"
            placeholder="예: 스파이더맨"
            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
          >
            검색
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">영화 검색</h1>
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white py-1.5 pl-4 pr-1.5"
      >
        <img src="/icons/search.svg" alt="" aria-hidden="true" className="size-5 opacity-60" />
        <label htmlFor="search-query" className="sr-only">
          영화 검색
        </label>
        <input
          key={query}
          id="search-query"
          name="query"
          defaultValue={query}
          className="h-9 flex-1 bg-transparent text-sm font-semibold outline-none"
        />
        <Link href="/search" aria-label="검색어 지우기" className="rounded p-1 hover:bg-gray-100">
          <img src="/icons/close.svg" alt="" aria-hidden="true" className="size-5 opacity-60" />
        </Link>
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
        >
          다시 검색
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-base font-bold">{`'${keyword}' 검색 결과`}</h2>
        {searchQuery.isSuccess && (
          <p className="text-xs text-gray-400">총 {totalResults.toLocaleString()}개</p>
        )}
      </div>

      {searchQuery.isPending ? (
        <StatusMessage>영화 목록을 불러오는 중이에요.</StatusMessage>
      ) : searchQuery.isError ? (
        <StatusMessage tone="error">검색 결과를 불러오지 못했어요.</StatusMessage>
      ) : movies.length === 0 ? (
        <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>
      ) : (
        <ul className="grid gap-x-12 md:grid-cols-2">
          {movies.map((movie) => (
            <li key={movie.id} className="flex gap-5 border-b border-gray-200 py-6">
              <Link
                href={`/movies/${movie.id}`}
                className="shrink-0"
                tabIndex={-1}
              >
                <img
                  src={getTmdbImageUrl(movie.poster_path)}
                  alt={`${movie.title} 포스터`}
                  loading="lazy"
                  className="aspect-[2/3] w-24 rounded-md bg-gray-200 object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-col">
                <h3 className="font-bold">
                  <Link
                    href={`/movies/${movie.id}`}
                    className="hover:underline"
                  >
                    {movie.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {movie.original_title} · {formatDate(movie.release_date)}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {movie.overview}
                </p>
                <Link
                  href={`/movies/${movie.id}`}
                  className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-blue-600"
                >
                  상세보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
