import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLocaleLowerCase("ko-KR") ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          movie.originalTitle.toLocaleLowerCase("en-US").includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="min-h-[calc(100vh-58px)] bg-[#f5f6f8]">
      <section className="mx-auto w-full max-w-7xl px-4 py-7 md:px-10 xl:px-0">
        <h1 className="mb-5 text-[28px] leading-tight font-extrabold tracking-tight text-slate-900">
          영화 검색
        </h1>

        <form className="relative max-w-2xl" onSubmit={handleSubmit} role="search">
          <label className="sr-only" htmlFor="movie-search">
            영화 제목 검색
          </label>
          <input
            className="h-11 w-full rounded-md border border-slate-300 bg-white pr-12 pl-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="movie-search"
            name="query"
            type="search"
            placeholder="영화 제목을 입력해 주세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded bg-slate-900 transition hover:bg-[#1e88ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            type="submit"
            aria-label="검색"
          >
            <img className="size-4 invert" src="/icons/search.svg" alt="" />
          </button>
        </form>

        {!normalizedQuery ? (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-white shadow-sm">
                <img className="size-6 opacity-45" src="/icons/search.svg" alt="" />
              </span>
              <p className="text-base font-bold text-slate-600">검색어를 입력해 주세요.</p>
              <p className="mt-1 text-sm text-slate-400">
                한글 제목과 원제로 영화를 찾을 수 있어요.
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">
                &lsquo;{query?.trim()}&rsquo; 검색 결과
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                영화 <strong className="text-[#1e88ff]">{searchResults.length}</strong>편
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white/50 text-center">
                <div>
                  <p className="text-base font-bold text-slate-600">검색 결과가 없어요.</p>
                  <p className="mt-1 text-sm text-slate-400">다른 검색어로 다시 찾아보세요.</p>
                </div>
              </div>
            ) : (
              <ul className="grid list-none gap-x-10 gap-y-0 p-0 md:grid-cols-2">
                {searchResults.map((movie) => (
                  <li className="border-b border-slate-200 py-5 first:pt-0" key={movie.id}>
                    <Link
                      className="group grid grid-cols-[92px_minmax(0,1fr)] gap-4 text-inherit no-underline sm:grid-cols-[116px_minmax(0,1fr)]"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        className="aspect-[2/3] w-full rounded object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                      <div className="min-w-0 py-1">
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#1e88ff]">
                          {movie.title}
                        </h3>
                        <p className="mt-1 truncate text-xs font-medium text-slate-400">
                          {movie.originalTitle}
                        </p>
                        <time
                          className="mt-2 block text-xs font-semibold text-slate-500"
                          dateTime={movie.releaseDate.replaceAll(".", "-")}
                        >
                          {movie.releaseDate}
                        </time>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {movie.overview}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
