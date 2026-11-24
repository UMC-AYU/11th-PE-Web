import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favorites/movie-favorite";
import { useAuthStore } from "../stores/auth-store";

type MovieFavoriteButtonProps = {
  movieId: number;
  movieTitle: string;
};

export function MovieFavoriteButton({
  movieId,
  movieTitle,
}: MovieFavoriteButtonProps) {
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const queryClient = useQueryClient();
  const statusKey = ["favorites", "status", movieId] as const;

  const statusQuery = useQuery({
    queryKey: statusKey,
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isLoggedIn,
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: (nextIsFavorite: boolean) =>
      nextIsFavorite ? addFavorite(movieId) : removeFavorite(movieId),
    onSuccess: (_, nextIsFavorite) => {
      queryClient.setQueryData(statusKey, nextIsFavorite);
      void queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });

  if (!isLoggedIn) return null;

  const isFavorite = statusQuery.data;
  const label = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";
  const icon = isFavorite
    ? "/icons/movie-icons/bookmark.svg"
    : "/icons/movie-icons/bookmark-outline.svg";

  return (
    <button
      type="button"
      className={`absolute right-2 top-2 grid size-[30px] place-items-center rounded-md disabled:opacity-50 ${
        isFavorite ? "bg-blue-600" : "bg-black/60"
      }`}
      aria-label={`${movieTitle} ${label}`}
      aria-pressed={isFavorite}
      title={statusQuery.isError ? "즐겨찾기 상태를 불러오지 못했어요." : label}
      disabled={isFavorite === undefined || favoriteMutation.isPending}
      onClick={() => {
        if (isFavorite !== undefined) {
          favoriteMutation.mutate(!isFavorite);
        }
      }}
    >
      <img src={icon} alt="" className="size-[18px]" />
    </button>
  );
}