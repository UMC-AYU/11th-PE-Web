import { useState } from 'react'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies)

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    )
  }

    return (
    <main className="min-h-[calc(100dvh-72px)] bg-[#f5f6f8]">
      <div className="mx-auto w-full max-w-[1000px] px-5 pb-16 pt-7 sm:px-10 sm:pb-24 sm:pt-10">
        <h1 className="mb-[22px] text-[32px] font-extrabold leading-[1.2] text-[#111827]">
          영화 목록
        </h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </div>
    </main>
  )
}