import type { Movie } from '../../types/movie'
import { Link } from '@tanstack/react-router'
import { cn } from "../../utils/cn";

type MovieCardProps = {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({ //movie, onToggleBookmark props 전달
  movie,
  onToggleBookmark, 
}: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked ? '북마크 해제' : '북마크 추가'
  const bookmarkIcon = movie.isBookmarked
    ? '/icons/movie-icons/bookmark.svg'
    : '/icons/movie-icons/bookmark-outline.svg'

    

  return (
    <article className="min-w-0">
  <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#e5e7eb] shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
      <img
    className="block h-full w-full object-cover"
    src={movie.posterPath}
    alt={movie.title}
  />
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 grid size-[30px] place-items-center rounded-md cursor-pointer",
             movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          aria-label={`${movie.title} ${bookmarkLabel}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
    
          <img className="size-[18px]" src={bookmarkIcon} alt="" />
        </button>
      </div>

      <h2 className="mt-[10px] mb-1 truncate text-sm font-extrabold leading-[1.35] text-[#111827]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <p className="text-xs leading-[1.4] text-[#6b7280]">
        {movie.releaseDate}
      </p>
    </article>
  )
}
