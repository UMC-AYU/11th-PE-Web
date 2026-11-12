import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMovieRoute = pathname === "/" || pathname === "/search" || pathname.startsWith("/movies/");
  const isProfileRoute = pathname === "/my" || pathname.startsWith("/my/");

  return (
    <header className="h-[58px] border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 md:gap-8 md:px-10 xl:px-0">
        <Link className="inline-flex shrink-0 items-center gap-2 text-[13px] font-extrabold text-slate-900 no-underline" to="/" aria-label="UMCine 홈">
          <span className="grid size-[22px] place-items-center rounded-[5px] border border-slate-900" aria-hidden="true">
            <img className="size-4" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>
        <nav className="flex items-center gap-7" aria-label="주요 메뉴">
          <Link className={cn("hidden text-xs font-bold text-slate-500 no-underline transition-colors hover:text-slate-900 sm:inline", isMovieRoute && "text-slate-900")} to="/" aria-current={isMovieRoute ? "page" : undefined}>영화</Link>
          <span className="hidden cursor-default text-xs font-bold text-slate-400 sm:inline">상영</span>
          <Link className={cn("text-xs font-bold whitespace-nowrap text-slate-500 hover:text-slate-900", isProfileRoute && "text-slate-900")} to="/my">내 정보</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <Link className={cn("grid size-[34px] place-items-center rounded-[5px] border border-slate-200 bg-white transition-colors hover:bg-slate-50", pathname === "/search" && "border-blue-500 bg-blue-50")} to="/search" search={{}} aria-label="영화 검색">
            <img className="size-4 opacity-70" src="/icons/search.svg" alt="" />
          </Link>
          <Link className="inline-flex h-[34px] min-w-[52px] items-center justify-center rounded-[5px] bg-[#1e88ff] px-3.5 text-xs font-extrabold whitespace-nowrap text-white hover:bg-blue-600" to="/login">로그인</Link>
        </div>
      </div>
    </header>
  );
}
