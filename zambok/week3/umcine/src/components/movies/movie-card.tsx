import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          className={cn(
            "absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition",
            movie.isBookmarked
              ? "bg-blue-600 shadow-lg shadow-blue-600/30"
              : "bg-black/60 hover:bg-black/80",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-5 w-5"
          />
        </button>
      </div>

      <div className="pt-4">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block"
        >
          <h2 className="truncate text-base font-bold text-white transition group-hover:text-blue-400">
            {movie.title}
          </h2>
        </Link>

        <p className="mt-1 truncate text-sm text-zinc-500">
          {movie.originalTitle}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
          <span>{movie.releaseDate}</span>
          <span className="text-zinc-700">•</span>
          <span>{movie.runtime}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-zinc-400"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}