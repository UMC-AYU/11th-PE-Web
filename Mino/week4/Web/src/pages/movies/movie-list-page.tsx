import { useMemo, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { CardSizeControl } from "../../components/movies/card-size-control";
import { movies } from "../../data/movies";
import { useViewPreferenceStore } from "../../stores/view-preference-store";

const moviesPerPage = 10;

export default function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardSize = useViewPreferenceStore((state) => state.cardSize);
  const setCardSize = useViewPreferenceStore((state) => state.setCardSize);
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const visibleMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return movies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage]);

  return (
    <div className="flex min-h-[calc(100vh-58px)] flex-col bg-[#f5f6f8]">
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 py-7 md:px-10 xl:px-0" aria-labelledby="movie-list-title">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h1 className="text-[28px] leading-tight font-extrabold tracking-tight text-slate-900" id="movie-list-title">영화 목록</h1>
            <CardSizeControl value={cardSize} onChange={setCardSize} />
          </div>
          <MovieGrid movies={visibleMovies} cardSize={cardSize} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl items-center justify-end gap-2 px-4 pt-4 pb-6 text-[10px] leading-tight text-slate-400 md:px-10 xl:px-0">
        <img className="h-[9px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span className="max-w-[260px] text-right sm:max-w-none">This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
