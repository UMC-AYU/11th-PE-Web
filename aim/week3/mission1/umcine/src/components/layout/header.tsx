import { Link } from "@tanstack/react-router";

export function Header() {
 return (
  <header className="h-[72px] border-b border-gray-200 bg-white">
    <nav
      className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6"
      aria-label="주 메뉴"
    >
      <div className="flex items-center gap-5 sm:gap-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <img src="/icons/movie-icons/movie.svg" alt="" className="size-6" />
          <span>UMCine</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            영화
          </Link>
          <Link to="/search" className="text-gray-600 hover:text-gray-900">
            검색
          </Link>
        </div>
      </div>

      <Link
        to="/search"
        aria-label="영화 검색"
        className="grid size-9 place-items-center rounded-md border border-gray-200 hover:bg-gray-50"
      >
        <img src="/icons/movie-icons/search.svg" alt="" className="size-5" />
      </Link>
    </nav>
  </header>
);
}