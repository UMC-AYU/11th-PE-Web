import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

type MovieGridProps = {
  movies: TmdbMovieListItem[];
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

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul
      aria-busy="true"
      aria-label="영화 목록을 불러오는 중이에요."
      className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="animate-pulse">
          <div className="aspect-[2/3] w-full rounded-[10px] bg-gray-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mt-1 h-3 w-1/3 rounded bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}
