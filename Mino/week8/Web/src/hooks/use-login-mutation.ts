import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { loginMutationOptions } from "../api/auth/auth-mutations";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    ...loginMutationOptions(),
    onSuccess: async ({ accessToken }) => {
      useAuthStore.getState().setAccessToken(accessToken);
      await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      await navigate({ to: "/" });
    },
  });
}
