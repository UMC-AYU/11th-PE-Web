import type { Movie } from '../types/movie'
import MovieCard from './movie-card'

type MovieGridProps = {
  movies: Movie[]
  onToggleBookmark: (movieId: number) => void
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section className="movie-grid" aria-label="영화 목록">
      {movies.map((movie) => ( //map()으로 영화 10개 목록 렌더링
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  )
}
