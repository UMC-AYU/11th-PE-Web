import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useMemo } from "react";
import { useMovies } from "../../context/movie-context";

const searchRoute = getRouteApi("/search");

export function SearchPage() {
  const { query } = searchRoute.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { movies } = useMovies();
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLocaleLowerCase("ko-KR");

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return movies.filter((movie) =>
      [movie.title, movie.originalTitle, movie.overview].some((value) =>
        value.toLocaleLowerCase("ko-KR").includes(normalizedQuery),
      ),
    );
  }, [movies, normalizedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = String(formData.get("query") ?? "").trim();

    void navigate({
      search: { query: searchValue },
      replace: searchValue === query,
    });
  }

  if (!normalizedQuery) {
    return (
      <main className="flex flex-1 justify-center bg-[#f7f8fa] px-6 pt-[210px] max-sm:pt-28">
        <section className="w-full max-w-[800px] text-center" aria-labelledby="search-title">
          <h1
            id="search-title"
            className="mb-10 text-[40px] leading-[1.25] font-extrabold tracking-[-1.7px] text-[#17191f] max-sm:text-[32px]"
          >
            어떤 영화를 찾고 있나요?
          </h1>
          <SearchForm query="" onSubmit={handleSubmit} />
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f7f8fa] pt-[27px] pb-12">
      <div className="mx-auto w-[min(1280px,calc(100%-160px))] max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
        <h1 className="mb-4 text-[34px] leading-[1.3] font-extrabold tracking-[-1.5px] text-[#17191f]">
          영화 검색
        </h1>

        <SearchForm query={query} onSubmit={handleSubmit} isResult />

        <section aria-labelledby="search-results-title">
          <div className="flex items-center justify-between border-b border-[#dfe3e8] py-[15px]">
            <h2
              id="search-results-title"
              className="m-0 text-[18px] font-extrabold tracking-[-0.4px] text-[#25282f]"
            >
              ‘{trimmedQuery}’ 검색 결과
            </h2>
            <p className="m-0 text-xs text-[#9ba3af]">
              영화 {results.length}편 · 1페이지
            </p>
          </div>

          {results.length === 0 ? (
            <div className="grid min-h-72 place-items-center text-center">
              <p className="text-base font-semibold text-[#69717e]">
                검색 결과가 없어요.
              </p>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-x-10 p-0 max-lg:grid-cols-1">
              {results.map((movie) => (
                <li
                  className="min-h-[238px] border-b border-[#dfe3e8] py-[15px]"
                  key={movie.id}
                >
                  <article className="grid grid-cols-[128px_minmax(0,1fr)] gap-[18px] max-sm:grid-cols-[92px_minmax(0,1fr)]">
                    <Link
                      className="block overflow-hidden rounded-lg focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      aria-label={`${movie.title} 상세 보기`}
                    >
                      <img
                        className="h-[190px] w-32 object-cover transition-transform duration-300 hover:scale-[1.025] max-sm:h-[138px] max-sm:w-[92px]"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>

                    <div className="flex min-w-0 flex-col pt-0.5">
                      <h3 className="m-0 overflow-hidden text-[17px] leading-6 font-extrabold tracking-[-0.4px] text-ellipsis whitespace-nowrap text-[#25282f]">
                        {movie.title}
                      </h3>
                      <p className="mt-1 mb-[9px] flex flex-wrap gap-x-3 text-xs leading-5 text-[#9ba3af]">
                        <span>{movie.originalTitle}</span>
                        <span>{movie.releaseDate}</span>
                      </p>
                      <p className="m-0 line-clamp-2 text-[13px] leading-6 text-[#69717e]">
                        {movie.overview}
                      </p>
                      <Link
                        className="mt-auto inline-flex items-center gap-2 self-start text-[13px] font-bold text-[#2f6ce5] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ce5]"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기 <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

interface SearchFormProps {
  query: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isResult?: boolean;
}

function SearchForm({ query, onSubmit, isResult = false }: SearchFormProps) {
  return (
    <form
      className="flex h-[74px] items-center rounded-[12px] border-2 border-[#202329] bg-white px-4 shadow-[0_12px_28px_rgba(23,25,31,0.08)] data-[result=true]:h-[54px] data-[result=true]:rounded-[9px] data-[result=true]:border data-[result=true]:border-[#dde2e9] data-[result=true]:shadow-none"
      data-result={isResult}
      onSubmit={onSubmit}
      role="search"
    >
      <label className="sr-only" htmlFor="movie-search">
        영화 제목 검색
      </label>
      <img
        className="mr-4 size-6 opacity-65 data-[result=true]:size-5"
        data-result={isResult}
        src="/icons/search.svg"
        alt=""
      />
      <input
        key={query}
        id="movie-search"
        name="query"
        className="min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-[#25282f] outline-none placeholder:font-normal placeholder:text-[#a3abb7]"
        type="text"
        inputMode="search"
        defaultValue={query}
        placeholder="예: 스파이더맨"
        autoFocus
      />

      {isResult && (
        <Link
          className="mr-4 grid size-8 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-[#2f6ce5]"
          to="/search"
          search={{ query: "" }}
          aria-label="검색어 지우기"
        >
          <img className="size-5 opacity-65" src="/icons/close.svg" alt="" />
        </Link>
      )}

      <button
        className="h-[44px] shrink-0 cursor-pointer rounded-lg border-0 bg-[#17191f] px-5 text-sm font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#17191f]/30 data-[result=true]:h-10"
        data-result={isResult}
        type="submit"
      >
        {isResult ? "다시 검색" : "검색"}
      </button>
    </form>
  );
}
