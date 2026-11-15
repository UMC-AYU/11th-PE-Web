import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

type MovieGridProps = {
  movies: Movie[];
};

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}
