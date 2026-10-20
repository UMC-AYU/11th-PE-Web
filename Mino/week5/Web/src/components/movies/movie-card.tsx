import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps { movie: Movie }

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[1/1.14] w-full overflow-hidden rounded bg-slate-200 shadow-sm">
        <Link className="group block size-full" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="block size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <MovieCardBookmark movie={movie} />
      </div>
      <div className="pt-2.5">
        <h2 className="mb-0.5 line-clamp-2 min-h-8 text-[13px] leading-4 font-extrabold text-slate-900">
          <Link className="text-inherit no-underline hover:underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
        </h2>
        <time className="block text-[11px] leading-tight font-medium text-slate-400" dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
      </div>
    </article>
  );
}

function MovieCardBookmark({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movie.id));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return <BookmarkButton className="absolute top-2 right-2 size-7 rounded border-white/85 bg-slate-900/70 hover:-translate-y-0.5" movieTitle={movie.title} isBookmarked={isBookmarked} onToggle={() => toggleBookmark(movie.id)} unbookmarkedIconLight />;
}
