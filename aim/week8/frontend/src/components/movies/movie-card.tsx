import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

type MovieCardProps = {
  movie: TmdbMovieListItem;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#e5e7eb] shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
        {posterUrl ? (
          <img
            className="block h-full w-full object-cover"
            src={posterUrl}
            alt={movie.title}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
      </div>

      <h2 className="mb-1 mt-[10px] truncate text-sm font-extrabold leading-[1.35] text-[#111827]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <p className="text-xs leading-[1.4] text-[#6b7280]">
        {movie.release_date}
      </p>
    </article>
  );
}