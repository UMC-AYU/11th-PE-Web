import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-blue-400">
            MOVIES
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            영화 목록
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            지금 볼 수 있는 영화를 확인해 보세요.
          </p>
        </div>

        <p className="hidden text-sm text-zinc-500 sm:block">
          총 {movies.length}편
        </p>
      </section>

      <MovieGrid movies={movies} />

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}