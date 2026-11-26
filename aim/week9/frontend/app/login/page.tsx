"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/src/features/auth/login-page";
import { useHydrated } from "@/src/hooks/use-hydrated";
import { useAuthStore } from "@/src/stores/auth-store";

export default function Page() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isHydrated && accessToken) {
      router.replace("/");
    }
  }, [isHydrated, accessToken, router]);

  if (!isHydrated || accessToken) {
    return <main role="status">로그인 상태를 확인하는 중이에요.</main>;
  }

  return <LoginPage />;
}