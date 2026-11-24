import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
import { favoriteStatusQueryOptions } from "../../api/favorites/favorites";
import { getApiErrorMessage } from "../../api/api-response";
import { useFavoriteMutation } from "../../hooks/use-favorite-mutation";
import { BookmarkButton } from "./bookmark-button";

export function ServerBookmarkButton({ movieId, title }: { movieId: number; title: string }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  const statusQuery = useQuery(favoriteStatusQueryOptions(memberId, movieId));
  const { mutation, isChanging } = useFavoriteMutation(movieId);

  if (!token) return <Link className="shrink-0 text-sm font-bold text-blue-700" href="/login">로그인 후 즐겨찾기</Link>;
  if (statusQuery.isError) return (
    <button className="text-xs text-red-700" type="button" onClick={() => void statusQuery.refetch()}>즐겨찾기 조회 재시도</button>
  );

  return (
    <div className="flex max-w-44 flex-col items-end gap-2">
      <BookmarkButton className="size-10 shrink-0 rounded-full border-slate-200 bg-white"
        movieTitle={title} isBookmarked={statusQuery.data?.isFavorite ?? false}
        disabled={statusQuery.isPending || isChanging}
        onToggle={() => mutation.mutate(!statusQuery.data?.isFavorite)} />
      {mutation.isError && <p role="alert" className="text-xs text-red-700">{getApiErrorMessage(mutation.error)}</p>}
    </div>
  );
}
