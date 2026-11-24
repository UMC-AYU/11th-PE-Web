import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from './movie-card'

type MovieGridProps = {
  movies: TmdbMovieListItem[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section
      className="grid grid-cols-2 gap-x-5 gap-y-7 min-[641px]:grid-cols-3 min-[901px]:grid-cols-5"
      aria-label="영화목록"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  )
}