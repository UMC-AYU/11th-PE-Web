"use client";

import { Suspense, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/api/api-client";
import { getMe } from "@/api/members/me";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

const navLinkClass = "text-sm text-gray-500 hover:text-gray-900";
const activeNavLinkClass = "font-semibold text-gray-900 underline underline-offset-8";

const navItems = [
  { href: "/", label: "영화", exact: true },
  { href: "/search", label: "검색" },
  { href: "/members", label: "회원" },
  { href: "/me", label: "내 정보" },
];

// TanStack Router의 activeProps 대신, 현재 주소(usePathname)와 비교해서 메뉴를 강조해요.
function NavMenu() {
  const pathname = usePathname();
  return (
    <>
      {navItems.map(({ href, label, exact }) => {
        const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={cn(navLinkClass, isActive && activeNavLinkClass)}>
            {label}
          </Link>
        );
      })}
    </>
  );
}

// 현재 주소는 요청이 와야 알 수 있어서, 빌드할 때는 강조 없는 메뉴를 먼저 보여 줘요.
function NavMenuFallback() {
  return (
    <>
      {navItems.map(({ href, label }) => (
        <Link key={href} href={href} className={navLinkClass}>
          {label}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  const queryClient = useQueryClient();
  const router = useRouter();
  // localStorage에서 토큰을 다 읽기 전에는 로그인 여부를 모르니까, 그 전엔 버튼 자리를 비워 둬요.
  const hasHydrated = useAuthHydrated();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken), // 토큰이 있을 때만 조회해요.
    staleTime: 5 * 60 * 1000, // 내 정보는 자주 바뀌지 않아서 5분
    retry: false,
  });

  // 토큰이 만료되거나 잘못되면 서버가 401을 돌려줘요. 그때는 토큰을 지워 로그아웃 상태로 돌려요.
  const isUnauthorized = meQuery.error instanceof ApiError && meQuery.error.status === 401;
  useEffect(() => {
    if (isUnauthorized) clearAccessToken();
  }, [isUnauthorized, clearAccessToken]);

  const handleLogout = () => {
    clearAccessToken();
    // 이전 사용자의 내 정보가 화면에 남지 않도록 캐시를 지워요.
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    router.push("/");
  };

  const me = accessToken ? meQuery.data : undefined;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gray-900">
            <img src="/icons/movie.svg" alt="" aria-hidden="true" className="size-5 invert" />
          </span>
          UMCine
        </Link>
        <nav className="flex items-center gap-6">
          {/* usePathname은 주소에서 값을 읽어서 Suspense로 감싸야 해요. (Cache Components) */}
          <Suspense fallback={<NavMenuFallback />}>
            <NavMenu />
          </Suspense>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            aria-label="검색"
            className="flex size-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <img src="/icons/search.svg" alt="" aria-hidden="true" className="size-5" />
          </Link>

          {me ? (
            // 로그인 상태: 내 닉네임과 로그아웃 버튼
            <>
              <Link
                href="/me"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                <img src="/icons/person.svg" alt="" aria-hidden="true" className="size-5 opacity-60" />
                {me.nickname}님
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          ) : !hasHydrated || (accessToken && meQuery.isPending) ? (
            // 저장된 토큰을 아직 읽는 중이거나, 토큰은 있고 내 정보를 불러오는 중이에요.
            // 서버가 그린 화면과 브라우저의 첫 화면이 같아야 hydration 오류가 나지 않아서, 이 자리를 비워 둬요.
            <span className="h-9 w-24 animate-pulse rounded-md bg-gray-100" aria-label="내 정보를 불러오는 중" />
          ) : (
            // 로그아웃 상태: 회원가입과 로그인 버튼
            <>
              <Link
                href="/signup"
                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
