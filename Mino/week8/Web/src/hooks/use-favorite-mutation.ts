import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteKeys, favoriteMutationOptions } from "../api/favorites/favorites";
import { getMemberId, useAuthStore } from "../stores/auth-store";

export function useFavoriteMutation(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const queryClient = useQueryClient();
  const isChanging = useIsMutating({ mutationKey: favoriteKeys.change(memberId, movieId) }) > 0;
  const mutation = useMutation({
    ...favoriteMutationOptions(memberId, movieId),
    onMutate: () => Promise.all([
      queryClient.cancelQueries({ queryKey: favoriteKeys.status(memberId, movieId) }),
      queryClient.cancelQueries({ queryKey: favoriteKeys.list(memberId) }),
    ]),
    onSuccess: async (isFavorite) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      queryClient.setQueryData(favoriteKeys.status(memberId, movieId), { isFavorite });
      await queryClient.invalidateQueries({ queryKey: favoriteKeys.list(memberId) });
    },
    onError: () => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.status(memberId, movieId) });
      void queryClient.invalidateQueries({ queryKey: favoriteKeys.list(memberId) });
    },
  });

  return { mutation, isChanging };
}
