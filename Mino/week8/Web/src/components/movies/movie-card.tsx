import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useQuery } from "@tanstack/react-query";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
import { favoritesQueryOptions } from "../../api/favorites/favorites";
import { useFavoriteMutation } from "../../hooks/use-favorite-mutation";
import { getApiErrorMessage } from "../../api/api-response";
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
  const token = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useQuery(favoritesQueryOptions(getMemberId(token)));
  const { mutation, isChanging } = useFavoriteMutation(movie.id);
  const isBookmarked = favoritesQuery.data?.some((favorite) => favorite.movieId === movie.id) ?? false;

  if (!token) return <Link className="absolute top-2 right-2 grid size-7 place-items-center rounded border border-white/85 bg-slate-900/70" to="/login" aria-label={`${movie.title} 즐겨찾기는 로그인 후 이용`}><img className="size-[18px] invert" src="/icons/bookmark-outline.svg" alt="" /></Link>;

  return <>
    <BookmarkButton className="absolute top-2 right-2 size-7 rounded border-white/85 bg-slate-900/70 hover:-translate-y-0.5" movieTitle={movie.title} isBookmarked={isBookmarked} disabled={favoritesQuery.isPending || isChanging || favoritesQuery.isError} onToggle={() => mutation.mutate(!isBookmarked)} unbookmarkedIconLight />
    {(mutation.isError || favoritesQuery.isError) && <button className="absolute right-1 bottom-1 left-1 rounded bg-white p-2 text-xs text-red-700" onClick={() => { mutation.reset(); void favoritesQuery.refetch(); }} type="button" title={getApiErrorMessage(mutation.error || favoritesQuery.error)}>즐겨찾기 오류 · 다시 시도</button>}
  </>;
}
