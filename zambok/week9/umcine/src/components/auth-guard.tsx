"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import { useHydrated } from "../app/providers";

export function AuthGuard({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !token) router.replace("/login?expired=true");
  }, [hydrated, token, router]);
  if (!hydrated || !token) return <p role="status">로그인 상태를 확인하는 중이에요.</p>;
  return children;
}
