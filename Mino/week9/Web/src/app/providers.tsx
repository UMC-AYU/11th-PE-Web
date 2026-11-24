"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";
import { useViewPreferenceStore } from "../stores/view-preference-store";

const HydratedContext = createContext(false);
export const useHydrated = () => useContext(HydratedContext);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.accessToken === previous.accessToken) return;
      for (const scope of ["members", "favorites", "ratings"]) {
        void queryClient.cancelQueries({ queryKey: [scope] });
        queryClient.removeQueries({ queryKey: [scope] });
      }
    });
    void Promise.all([
      useAuthStore.persist.rehydrate(),
      useViewPreferenceStore.persist.rehydrate(),
    ]).then(() => {
      if (active) setHydrated(true);
    });
    return () => { active = false; unsubscribe(); };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <HydratedContext.Provider value={hydrated}>{children}</HydratedContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
