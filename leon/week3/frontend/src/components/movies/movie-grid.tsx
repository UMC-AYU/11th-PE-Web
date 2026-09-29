import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section
      className="grid grid-cols-5 gap-x-[18px] gap-y-[21px] max-lg:grid-cols-3 max-sm:grid-cols-2"
      id="movie-list"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}
