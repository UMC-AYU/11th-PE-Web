import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { adaptTmdbMovieListItem } from "../../api/movies/movie-adapter";
import {
  searchMovies,
  type SearchMoviesResponse,
} from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { Pagination } from "../../components/movies/pagination";
import {
  RequestError,
  RequestLoading,
} from "../../components/movies/request-state";
import { useBookmarkStore } from "../../stores/bookmark-store";

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SearchMoviesResponse };

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const bookmarkedMovieIds = useBookmarkStore(
    (store) => store.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((store) => store.toggleBookmark);
  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

  useEffect(() => {
    if (!normalizedQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    searchMovies({
      query: normalizedQuery,
      page,
      signal: controller.signal,
    })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했어요.",
          });
        }
      });

    return () => controller.abort();
  }, [normalizedQuery, page, requestVersion]);

  const searchResults =
    state.status === "success"
      ? state.data.results.map(adaptTmdbMovieListItem)
      : [];
  const totalPages =
    state.status === "success" ? Math.min(state.data.total_pages, 500) : 1;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  function changePage(nextPage: number) {
    navigate({
      search:
        nextPage > 1
          ? { query: normalizedQuery, page: nextPage }
          : { query: normalizedQuery },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section className="mx-auto w-full max-w-7xl px-4 py-7 md:px-10 xl:px-0">
        <h1 className="mb-5 text-[28px] leading-tight font-extrabold tracking-tight text-slate-900">
          영화 검색
        </h1>
        <form className="relative max-w-2xl" onSubmit={handleSubmit} role="search">
          <label className="sr-only" htmlFor="movie-search">
            영화 제목 검색
          </label>
          <input
            className="h-11 w-full rounded-md border border-slate-300 bg-white pr-12 pl-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            id="movie-search"
            name="query"
            type="search"
            placeholder="영화 제목을 입력해 주세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded bg-slate-900 hover:bg-[#1e88ff]"
            type="submit"
            aria-label="검색"
          >
            <img className="size-4 invert" src="/icons/search.svg" alt="" />
          </button>
        </form>

        {state.status === "idle" ? (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-white shadow-sm">
                <img className="size-6 opacity-45" src="/icons/search.svg" alt="" />
              </span>
              <p className="text-base font-bold text-slate-600">검색어를 입력해 주세요.</p>
              <p className="mt-1 text-sm text-slate-400">한글 제목과 원제로 영화를 찾을 수 있어요.</p>
            </div>
          </div>
        ) : null}
        {state.status === "loading" ? (
          <RequestLoading label={`‘${normalizedQuery}’ 검색 결과를 불러오는 중이에요.`} />
        ) : null}
        {state.status === "error" ? (
          <RequestError
            message={state.message}
            onRetry={() => setRequestVersion((version) => version + 1)}
          />
        ) : null}
        {state.status === "success" ? (
          <div className="pt-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold">&lsquo;{normalizedQuery}&rsquo; 검색 결과</h2>
              <p className="text-sm font-semibold text-slate-500">
                영화 <strong className="text-[#1e88ff]">{state.data.total_results.toLocaleString("ko-KR")}</strong>편
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
              <>
                <ul className="grid list-none gap-x-10 p-0 md:grid-cols-2">
                  {searchResults.map((movie) => {
                    const isBookmarked = bookmarkedMovieIds.includes(movie.id);
                    return (
                      <li className="relative border-b border-slate-200 py-5 first:pt-0" key={movie.id}>
                        <Link className="group grid grid-cols-[92px_minmax(0,1fr)] gap-4 pr-11 text-inherit no-underline sm:grid-cols-[116px_minmax(0,1fr)]" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                          <img className="aspect-[2/3] w-full rounded bg-slate-200 object-cover shadow-sm" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                          <div className="min-w-0 py-1">
                            <h3 className="text-base font-extrabold group-hover:text-[#1e88ff]">{movie.title}</h3>
                            <p className="mt-1 truncate text-xs font-medium text-slate-400">{movie.originalTitle}</p>
                            <time className="mt-2 block text-xs font-semibold text-slate-500" dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{movie.overview}</p>
                          </div>
                        </Link>
                        <BookmarkButton className="absolute top-5 right-0 size-9 rounded-full border-slate-200 bg-white" movieTitle={movie.title} isBookmarked={isBookmarked} onToggle={() => toggleBookmark(movie.id)} />
                      </li>
                    );
                  })}
                </ul>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
              </>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
