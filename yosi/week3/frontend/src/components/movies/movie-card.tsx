import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/format";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="relative">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="group block">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-full overflow-hidden rounded-[10px] bg-gray-200 object-cover transition group-hover:brightness-90"
        />
        <h2 className="mt-2 truncate text-sm font-bold text-gray-900">{movie.title}</h2>
      </Link>
      <p className="text-xs text-gray-400">{formatDate(movie.releaseDate)}</p>
      <button
        type="button"
        aria-label={movie.isBookmarked ? "북마크 해제" : "북마크"}
        aria-pressed={movie.isBookmarked}
        className={cn(
          "absolute right-2 top-2 flex size-7 items-center justify-center rounded-md shadow-sm",
          movie.isBookmarked ? "bg-blue-600" : "bg-white/90",
        )}
      >
        <img
          src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
          aria-hidden="true"
          className={cn("size-4", movie.isBookmarked && "invert")}
        />
      </button>
    </article>
  );
}
