import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  isBookmarked: boolean
  onBookmarkToggle: (movieId: number) => void
}

export function MovieCard({
  movie,
  isBookmarked,
  onBookmarkToggle,
}: MovieCardProps) {
  const bookmarkLabel = isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크`

  return (
    <article className="min-w-0">
      <div className="relative aspect-[1/1.14] w-full overflow-hidden rounded bg-slate-200 shadow-sm">
        <Link
          className="group block size-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            "absolute right-2 top-2 grid size-7 cursor-pointer place-items-center rounded border border-white/85 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            isBookmarked
              ? "border-blue-500 bg-[#1e88ff]"
              : "bg-slate-900/70",
          )}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            className="size-[18px] invert"
            src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>
      <div className="pt-2.5">
        <h2 className="mb-0.5 line-clamp-2 min-h-8 text-[13px] leading-4 font-extrabold text-slate-900">
          <Link
            className="text-inherit no-underline hover:underline"
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
          >
            {movie.title}
          </Link>
        </h2>
        <time
          className="block text-[11px] leading-tight font-medium text-slate-400"
          dateTime={movie.releaseDate.replaceAll('.', '-')}
        >
          {movie.releaseDate}
        </time>
      </div>
    </article>
  )
}
