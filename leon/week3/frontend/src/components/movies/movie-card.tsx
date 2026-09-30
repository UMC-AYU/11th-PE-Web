import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`;

  return (
    <article className="min-w-0">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-[#e9ecf1] sm:aspect-[.885] sm:rounded-[10px]">
        <Link
          className="block h-full focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-white"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            className="block h-full w-full object-cover transition-transform duration-300 hover:scale-[1.025]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            "absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-lg border border-white/90 bg-[rgba(19,23,31,0.88)] p-0 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[rgba(47,108,229,0.35)] sm:top-[11px] sm:right-[11px] sm:size-9",
            movie.isBookmarked && "border-[#2f6ce5] bg-[#2f6ce5]",
          )}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-5 invert sm:size-6"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h2 className="mt-2 mb-0.5 overflow-hidden text-[13px] leading-5 font-bold tracking-[-0.35px] text-ellipsis whitespace-nowrap text-[#1d2026] sm:text-sm">
        <Link
          className="hover:text-[#2f6ce5] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ce5]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <p className="m-0 text-[11px] leading-[18px] text-[#99a1ad] sm:text-xs">
        {movie.releaseDate}
      </p>
    </article>
  );
}
