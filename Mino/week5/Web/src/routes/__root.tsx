import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { TmdbAttribution } from "../components/layout/tmdb-attribution";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8] text-slate-900 antialiased">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <TmdbAttribution />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto min-h-[calc(100vh-58px)] w-full max-w-7xl px-4 py-20 text-2xl font-extrabold md:px-10">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
