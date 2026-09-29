import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMovieRoute =
    pathname === "/" || pathname === "/search" || pathname.startsWith("/movies/");

  return (
    <header className="h-[58px] border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 md:gap-8 md:px-10 xl:px-0">
        <Link
          className="inline-flex shrink-0 items-center gap-2 text-[13px] font-extrabold text-slate-900 no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <span
            className="grid size-[22px] place-items-center rounded-[5px] border border-slate-900"
            aria-hidden="true"
          >
            <img className="size-4" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex" aria-label="주요 메뉴">
          <Link
            className={cn(
              "text-xs font-bold text-slate-500 no-underline transition-colors hover:text-slate-900",
              isMovieRoute && "text-slate-900",
            )}
            to="/"
            aria-current={isMovieRoute ? "page" : undefined}
          >
            영화
          </Link>
          <span className="cursor-default text-xs font-bold text-slate-400">상영</span>
          <span className="cursor-default text-xs font-bold text-slate-400">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            className={cn(
              "grid size-[34px] place-items-center rounded-[5px] border border-slate-200 bg-white transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
              pathname === "/search" && "border-blue-500 bg-blue-50",
            )}
            to="/search"
            search={{}}
            aria-label="영화 검색"
          >
            <img className="size-4 opacity-70" src="/icons/search.svg" alt="" />
          </Link>
          <button
            className="h-[34px] min-w-[52px] cursor-pointer rounded-[5px] border-0 bg-[#1e88ff] px-3.5 text-xs font-extrabold text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
