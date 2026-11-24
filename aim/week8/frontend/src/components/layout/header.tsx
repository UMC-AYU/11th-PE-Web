import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const accountLinkClassName =
  "grid h-9 w-24 place-items-center rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="h-[72px] border-b border-gray-200 bg-white">
      <nav
        className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
        aria-label="주 메뉴"
      >
        <div className="flex items-center gap-3 sm:gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
            <img src="/icons/movie-icons/movie.svg" alt="" className="size-6" />
            <span>UMCine</span>
          </Link>

          <div className="flex items-center gap-3 whitespace-nowrap text-sm sm:gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              영화
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-gray-900">
              검색
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900"
              activeProps={{ className: "font-semibold underline" }}
            >
              내 정보
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="hidden size-9 place-items-center rounded-md border border-gray-200 hover:bg-gray-50 sm:grid"
          >
            <img src="/icons/movie-icons/search.svg" alt="" className="size-5" />
          </Link>

          {!accessToken ? (
            <Link to="/login" className={accountLinkClassName}>
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              role="status"
              className="h-9 w-24 animate-pulse rounded-md bg-gray-200"
            >
              <span className="sr-only">내 정보 불러오는 중</span>
            </span>
          ) : (
            <Link to="/profile" className={accountLinkClassName}>
              마이페이지
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}