import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginMutationOptions } from "../api/auth/auth-mutations";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    ...loginMutationOptions(),
    onSuccess: async ({ accessToken }) => {
      useAuthStore.getState().setAccessToken(accessToken);
      await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.push("/");
    },
  });
}
