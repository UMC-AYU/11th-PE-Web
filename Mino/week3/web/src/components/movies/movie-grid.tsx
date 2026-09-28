import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

interface MovieGridProps {
  movies: Movie[]
  bookmarks: Record<number, boolean>
  onBookmarkToggle: (movieId: number) => void
}

export function MovieGrid({
  movies,
  bookmarks,
  onBookmarkToggle,
}: MovieGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 lg:gap-x-6"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={Boolean(bookmarks[movie.id])}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  )
}
