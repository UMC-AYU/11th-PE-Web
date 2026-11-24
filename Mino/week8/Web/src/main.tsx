import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { useAuthStore } from "./stores/auth-store";

const router = createRouter({ routeTree });
const ONE_MINUTE = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
});

useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  for (const scope of ["members", "favorites", "ratings"]) {
    void queryClient.cancelQueries({ queryKey: [scope] });
    queryClient.removeQueries({ queryKey: [scope] });
  }
  void router.invalidate();
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
