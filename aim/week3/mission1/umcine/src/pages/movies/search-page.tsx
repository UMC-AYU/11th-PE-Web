import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main
      className={
        normalizedQuery
          ? "min-h-[calc(100dvh-72px)] bg-[#f5f6f8] px-4 py-10 sm:px-6"
          : "flex min-h-[calc(100dvh-72px)] flex-col items-center justify-start bg-[#f5f6f8] px-4 pt-32 sm:px-6 sm:pt-36"
      }
    >
      <h1 className="mb-6 text-center text-3xl font-extrabold text-[#17191f]">
        어떤 영화를 찾고 있나요?
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-14 w-full max-w-[560px] items-center gap-3 rounded-lg border border-[#252932] bg-white px-3 shadow-sm"
      >
        <img
          src="/icons/movie-icons/search.svg"
          alt=""
          className="size-5 shrink-0"
        />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-[#17191f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#303540]"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-4 text-center text-sm text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <h2 className="mx-auto mt-10 w-full max-w-4xl text-xl font-bold text-gray-900">
            ‘{query}’ 검색 결과
          </h2>
          <p className="mx-auto mt-1 w-full max-w-4xl text-sm text-gray-500">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="mx-auto mt-6 w-full max-w-4xl text-sm text-gray-600">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="mx-auto mt-6 flex w-full max-w-4xl flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    aria-label={`${movie.title} 상세 보기`}
                    className="flex gap-4 p-4 hover:bg-gray-50"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="aspect-[2/3] w-24 shrink-0 rounded object-cover sm:w-32"
                    />

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">{movie.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {movie.originalTitle}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {movie.releaseDate}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-gray-700">
                        {movie.overview}
                      </p>
                      <span className="mt-3 inline-block text-sm font-semibold text-blue-600">
                        상세 보기
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}