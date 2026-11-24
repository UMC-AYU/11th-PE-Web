"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useHydrated } from "../../app/providers";
import { useAuthStore } from "../../stores/auth-store";
import { RequestLoading } from "../movies/request-state";

export function AuthGuard({ mode, children }: { mode: "authenticated" | "guest"; children: ReactNode }) {
  const hydrated = useHydrated();
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const needsRedirect = mode === "authenticated" ? !token : Boolean(token);

  useEffect(() => {
    if (hydrated && needsRedirect) router.replace(mode === "authenticated" ? "/login" : "/");
  }, [hydrated, needsRedirect, mode, router]);

  if (!hydrated || needsRedirect) return <RequestLoading label="로그인 정보를 확인하는 중이에요." />;
  return mode === "authenticated" ? <div className="flex flex-1 flex-col" data-layout="authenticated">{children}</div> : children;
}
