import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="py-32 text-center text-gray-500">페이지를 찾을 수 없어요.</main>
  ),
});
