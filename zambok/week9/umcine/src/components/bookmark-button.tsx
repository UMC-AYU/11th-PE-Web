"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { authApi } from "../api/auth-api";
import { type ApiResponse } from "../api/api-client";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { useHydrated } from "../app/providers";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({
  movieId,
  className,
}: BookmarkButtonProps) {
  const hydrated = useHydrated();
  const localBookmark = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const token = useAuthStore((state) => state.accessToken);
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  const queryClient = useQueryClient();
  const queryKey = ["member-session", sessionVersion, "favorites"] as const;
  const favorites = useQuery({
    queryKey,
    enabled: hydrated && !!token,
    queryFn: async ({ signal }) => {
      if (!token) throw new Error("로그인이 필요합니다.");
      const response = await authApi(token).get("favorites", { signal }).json<ApiResponse<{ movieId: number }[]>>();
      return response.result;
    },
  });
  const isBookmarked = token ? favorites.data?.some((item) => item.movieId === movieId) ?? false : localBookmark;
  const mutation = useMutation({
    mutationKey: [...queryKey, movieId],
    mutationFn: async () => {
      if (!token) return;
      const api = authApi(token);
      try {
        if (isBookmarked) await api.delete(`favorites/${movieId}`, { retry: 0 });
        else await api.post("favorites", { json: { movieId } });
      } catch (error) {
        if (!isHTTPError(error) || error.response.status !== (isBookmarked ? 404 : 409)) throw error;
      }
    },
    onSettled: async () => {
      if (useAuthStore.getState().sessionVersion === sessionVersion) {
        await queryClient.invalidateQueries({ queryKey, exact: true });
      }
    },
  });

  return (
    <button
      type="button"
      disabled={!hydrated || mutation.isPending || (!!token && !favorites.data && !favorites.isError)}
      title={mutation.isError ? "즐겨찾기 변경에 실패했습니다. 다시 시도해 주세요." : favorites.isError ? "즐겨찾기 조회 다시 시도" : undefined}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!token) toggleBookmark(movieId);
        else if (!favorites.data) void favorites.refetch();
        else mutation.mutate();
      }}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition",
        isBookmarked
          ? "bg-blue-600 shadow-lg shadow-blue-600/30"
          : "bg-black/60 hover:bg-black/80",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        className="h-5 w-5"
      />
    </button>
  );
}