import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { formatDate } from "../../utils/format";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const keyword = query.trim().toLowerCase();

  const results = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(keyword) ||
      movie.originalTitle.toLowerCase().includes(keyword),
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
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
        <Link to="/search" aria-label="검색어 지우기" className="rounded p-1 hover:bg-gray-100">
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
        <h2 className="text-base font-bold">'{query}' 검색 결과</h2>
        <p className="text-xs text-gray-400">총 {results.length}개</p>
      </div>

      {results.length === 0 ? (
        <p className="py-24 text-center text-gray-500">
          '{query}'에 맞는 영화가 없어요. 다른 검색어로 찾아보세요.
        </p>
      ) : (
        <ul className="grid gap-x-12 md:grid-cols-2">
          {results.map((movie) => (
            <li key={movie.id} className="flex gap-5 border-b border-gray-200 py-6">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="shrink-0"
                tabIndex={-1}
              >
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="aspect-[2/3] w-24 rounded-md bg-gray-200 object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-col">
                <h3 className="font-bold">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="hover:underline"
                  >
                    {movie.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {movie.originalTitle} · {formatDate(movie.releaseDate)}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
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
