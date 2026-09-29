import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const focusRing =
    "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[rgba(47,108,229,0.35)]";

  return (
    <header className="h-[90px] shrink-0 border-b border-[#e6e9ee] bg-white">
      <div className="mx-auto flex h-full w-[min(1280px,calc(100%-160px))] items-center max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
        <Link
          className={cn(
            "inline-flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.8px] text-[#17191f] no-underline",
            focusRing,
          )}
          to="/"
          aria-label="UMCine 홈"
        >
          <span
            className="grid size-8 place-items-center rounded-lg border-2 border-[#17191f]"
            aria-hidden="true"
          >
            <img className="size-[22px]" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav
          className="ml-[45px] flex items-center gap-8 max-sm:hidden"
          aria-label="주요 메뉴"
        >
          <Link
            className={cn(
              "py-[30px] text-[15px] leading-[26px] font-bold text-[#616875] no-underline",
              isMovieRoute &&
                "text-[#17191f] underline decoration-1 underline-offset-5",
              focusRing,
            )}
            to="/"
            aria-current={isMovieRoute ? "page" : undefined}
          >
            영화
          </Link>
          <Link
            className={cn(
              "py-[30px] text-[15px] leading-[26px] font-bold text-[#616875] no-underline",
              pathname === "/search" &&
                "text-[#17191f] underline decoration-1 underline-offset-5",
              focusRing,
            )}
            to="/search"
            search={{ query: "" }}
            aria-current={pathname === "/search" ? "page" : undefined}
          >
            검색
          </Link>
          <span className="py-[30px] text-[15px] leading-[26px] font-bold text-[#616875]">
            내 정보
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className={cn(
              "grid size-11 place-items-center rounded-lg border border-[#dde2e9] bg-white",
              focusRing,
            )}
            to="/search"
            search={{ query: "" }}
            aria-label="영화 검색"
          >
            <img className="size-6 opacity-65" src="/icons/search.svg" alt="" />
          </Link>
          <button
            className={cn(
              "h-11 cursor-pointer rounded-lg border-0 bg-[#2f6ce5] px-[18px] text-sm font-bold text-white",
              focusRing,
            )}
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
