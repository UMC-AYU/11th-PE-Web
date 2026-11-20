import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { popularMoviesQueryOptions } from "../../api/movies/movie-queries";
import { adaptTmdbMovieListItem } from "../../api/movies/movie-adapter";
import { CardSizeControl } from "../../components/movies/card-size-control";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestError, RequestLoading } from "../../components/movies/request-state";
import { useViewPreferenceStore } from "../../stores/view-preference-store";

export default function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const moviesQuery = useQuery(popularMoviesQueryOptions(page));
  const cardSize = useViewPreferenceStore((store) => store.cardSize);
  const setCardSize = useViewPreferenceStore((store) => store.setCardSize);

  const movies =
    moviesQuery.data?.results.map(adaptTmdbMovieListItem) ?? [];
  const totalPages = moviesQuery.data
    ? Math.min(moviesQuery.data.total_pages, 500)
    : 1;

  function changePage(nextPage: number) {
    navigate({ search: nextPage > 1 ? { page: nextPage } : {} });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section
        className="mx-auto w-full max-w-7xl px-4 py-7 md:px-10 xl:px-0"
        aria-labelledby="movie-list-title"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#1e88ff]">TMDB 인기 순위</p>
            <h1
              className="mt-1 text-[28px] leading-tight font-extrabold tracking-tight text-slate-900"
              id="movie-list-title"
            >
              인기 영화
            </h1>
          </div>
          <CardSizeControl value={cardSize} onChange={setCardSize} />
        </div>

        {moviesQuery.isPending ? <RequestLoading /> : null}
        {moviesQuery.isError ? (
          <RequestError
            message={moviesQuery.error.message}
            onRetry={() => void moviesQuery.refetch()}
          />
        ) : null}
        {moviesQuery.isSuccess && movies.length === 0 ? (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white/50 text-center">
            <p className="font-bold text-slate-500">표시할 인기 영화가 없어요.</p>
          </div>
        ) : null}
        {moviesQuery.isSuccess && movies.length > 0 ? (
          <>
            <MovieGrid movies={movies} cardSize={cardSize} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        ) : null}
      </section>
    </main>
  );
}
