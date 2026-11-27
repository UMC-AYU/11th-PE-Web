import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatDate } from "../../utils/format";
import { getTmdbImageUrl } from "../../utils/tmdb-image";

type MovieCardProps = {
  movie: TmdbMovieListItem;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="relative">
      <Link href={`/movies/${movie.id}`} className="group block">
        <img
          src={getTmdbImageUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
          loading="lazy"
          className="aspect-[2/3] w-full overflow-hidden rounded-[10px] bg-gray-200 object-cover transition group-hover:brightness-90"
        />
        <h2 className="mt-2 truncate text-sm font-bold text-gray-900">{movie.title}</h2>
      </Link>
      <p className="text-xs text-gray-400">{formatDate(movie.release_date)}</p>
      <button
        type="button"
        aria-label="북마크"
        aria-pressed={false}
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md bg-white/90 shadow-sm"
      >
        <img src="/icons/bookmark-outline.svg" alt="" aria-hidden="true" className="size-4" />
      </button>
    </article>
  );
}
