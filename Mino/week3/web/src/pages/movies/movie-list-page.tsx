import { useMemo, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const moviesPerPage = 10;

function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(movies.map((movie) => [movie.id, movie.isBookmarked])),
  )

  const totalPages = Math.ceil(movies.length / moviesPerPage)

  const visibleMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage
    return movies.slice(startIndex, startIndex + moviesPerPage)
  }, [currentPage])

  const handleBookmarkToggle = (movieId: number) => {
    setBookmarks((currentBookmarks) => ({
      ...currentBookmarks,
      [movieId]: !currentBookmarks[movieId],
    }))
  }

  return (
    <div className="flex min-h-[calc(100vh-58px)] flex-col bg-[#f5f6f8]">
      <main className="flex-1">
        <section
          className="mx-auto w-full max-w-7xl px-4 py-7 md:px-10 xl:px-0"
          aria-labelledby="movie-list-title"
        >
          <h1
            className="mb-5 text-[28px] leading-tight font-extrabold tracking-tight text-slate-900"
            id="movie-list-title"
          >
            영화 목록
          </h1>
          <MovieGrid
            movies={visibleMovies}
            bookmarks={bookmarks}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <footer className="mx-auto flex w-full max-w-7xl items-center justify-end gap-2 px-4 pt-4 pb-6 text-[10px] leading-tight text-slate-400 md:px-10 xl:px-0">
        <img className="h-[9px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span className="max-w-[260px] text-right sm:max-w-none">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </div>
  )
}

export default MovieListPage
