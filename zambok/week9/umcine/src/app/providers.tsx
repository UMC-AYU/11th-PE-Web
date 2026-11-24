"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";

const HydrationContext = createContext(false);
export function useHydrated() { return useContext(HydrationContext); }

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60000, gcTime: 300000, retry: 1 } },
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((session, previous) => {
      if (session.sessionVersion !== previous.sessionVersion) {
        const queryKey = ["member-session", previous.sessionVersion];
        void client.cancelQueries({ queryKey });
        client.removeQueries({ queryKey });
      }
    });
    let active = true;
    Promise.all([useAuthStore.persist.rehydrate(), useBookmarkStore.persist.rehydrate()])
      .finally(() => { if (active) setHydrated(true); });
    return () => { active = false; unsubscribe(); };
  }, [client]);

  const token = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (!hydrated || !token) return;
    let expiration = 0;
    try {
      const payload: unknown = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (typeof payload === "object" && payload !== null && "exp" in payload && typeof payload.exp === "number") {
        expiration = payload.exp * 1000;
      }
    } catch { /* Malformed persisted tokens are cleared after mounting. */ }
    const remaining = expiration - Date.now();
    const timer = setTimeout(() => {
      if (useAuthStore.getState().accessToken === token) useAuthStore.getState().setAccessToken(null);
    }, Math.max(0, Math.min(remaining, 2147483647)));
    return () => clearTimeout(timer);
  }, [hydrated, token]);

  return (
    <QueryClientProvider client={client}>
      <HydrationContext value={hydrated}>{children}</HydrationContext>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
