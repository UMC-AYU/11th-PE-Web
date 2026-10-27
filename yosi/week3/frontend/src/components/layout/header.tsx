import { Link } from "@tanstack/react-router";

const navLinkClass = "text-sm text-gray-500 hover:text-gray-900";
const activeNavLinkClass = "font-semibold text-gray-900 underline underline-offset-8";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gray-900">
            <img src="/icons/movie.svg" alt="" aria-hidden="true" className="size-5 invert" />
          </span>
          UMCine
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={navLinkClass}
            activeProps={{ className: activeNavLinkClass }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>
          <Link to="/search" className={navLinkClass} activeProps={{ className: activeNavLinkClass }}>
            검색
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <img src="/icons/search.svg" alt="" aria-hidden="true" className="size-5" />
          </Link>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
