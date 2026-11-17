import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    gcTime: 0,
    onSuccess: ({ result }) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      void navigate({ to: "/", replace: true });
    },
  });
}
