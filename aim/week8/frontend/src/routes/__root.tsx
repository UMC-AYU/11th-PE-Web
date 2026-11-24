import { createRootRoute, Outlet } from "@tanstack/react-router"; //모든 화면에서 유지
import { Header } from "../components/layout/header"; // URL애 따라 달라진다.

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="border-t border-gray-200 bg-white px-5 py-6">
  <section
    aria-label="데이터 출처"
    className="mx-auto max-w-[1000px]"
  >
    <h2 className="mb-3 text-sm font-semibold text-gray-700">
      데이터 출처
    </h2>

    <a href="https://www.themoviedb.org/">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
        className="h-auto w-24"
      />
    </a>

    <p className="mt-3 text-xs leading-5 text-gray-600">
      This product uses the TMDB API but is not endorsed or certified by TMDB.
    </p>
  </section>
</footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
