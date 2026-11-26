"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    gcTime: 0,
    onSuccess: ({ result }) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      router.replace("/");
    },
  });
}
