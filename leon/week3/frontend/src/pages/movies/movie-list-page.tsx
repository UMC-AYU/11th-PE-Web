import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useMovies } from "../../context/movie-context";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { movies, toggleBookmark } = useMovies();

  return (
    <main className="flex-1 bg-[#f7f8fa] py-5 pb-10 sm:py-[26px] sm:pb-14">
      <div className="mx-auto w-[min(1280px,calc(100%-160px))] max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
        <h1 className="mt-0 mb-[18px] text-[28px] leading-[1.3] font-extrabold tracking-[-1.4px] text-[#17191f] sm:mb-[22px] sm:text-[34px] sm:tracking-[-1.8px]">
          영화 목록
        </h1>
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
