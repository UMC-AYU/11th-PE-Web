import type { Movie } from "../../types/movie";
import type { CardSize } from "../../stores/view-preference-store";
import { cn } from "../../utils/cn";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  cardSize: CardSize;
}

export function MovieGrid({ movies, cardSize }: MovieGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5",
        cardSize === "comfortable" ? "lg:grid-cols-5 lg:gap-x-6" : "lg:grid-cols-6 lg:gap-x-5",
      )}
      aria-label="영화 목록"
      data-card-size={cardSize}
    >
      {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
}
