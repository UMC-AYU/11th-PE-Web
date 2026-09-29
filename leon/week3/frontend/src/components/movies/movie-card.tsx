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
      <div className="relative aspect-[.885] overflow-hidden rounded-[10px] bg-[#e9ecf1]">
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
            "absolute top-[11px] right-[11px] grid size-9 cursor-pointer place-items-center rounded-lg border border-white/90 bg-[rgba(19,23,31,0.88)] p-0 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[rgba(47,108,229,0.35)]",
            movie.isBookmarked && "border-[#2f6ce5] bg-[#2f6ce5]",
          )}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-6 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h2 className="mt-2 mb-0.5 overflow-hidden text-sm leading-5 font-bold tracking-[-0.35px] text-ellipsis whitespace-nowrap text-[#1d2026]">
        <Link
          className="hover:text-[#2f6ce5] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ce5]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <p className="m-0 text-xs leading-[18px] text-[#99a1ad]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
