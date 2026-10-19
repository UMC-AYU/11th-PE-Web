import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900 antialiased">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto min-h-[calc(100vh-58px)] w-full max-w-7xl px-4 py-20 text-2xl font-extrabold md:px-10">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
