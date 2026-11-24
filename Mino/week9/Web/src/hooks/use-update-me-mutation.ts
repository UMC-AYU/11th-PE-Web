import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeMutationOptions } from "../api/auth/auth-mutations";
import { meQueryOptions } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryKey = meQueryOptions(accessToken).queryKey;

  return useMutation({
    ...updateMeMutationOptions(),
    onMutate: () => queryClient.cancelQueries({ queryKey }),
    onSuccess: (member) => {
      if (useAuthStore.getState().accessToken === accessToken) {
        queryClient.setQueryData(queryKey, member);
      }
    },
  });
}
