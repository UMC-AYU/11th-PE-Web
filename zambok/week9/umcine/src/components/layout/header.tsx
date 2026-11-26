"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../../stores/auth-store";

export default function Header() {
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-white"
        >
          UMCine
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            영화
          </Link>

          <Link
            href="/search"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            검색
          </Link>

          {token ? (
            <>
              <Link href="/mypage" className="rounded-lg px-2 py-2 text-sm text-zinc-300 hover:text-white">
                내 정보
              </Link>
              <button
                type="button"
                className="rounded-lg px-2 py-2 text-sm text-zinc-300 hover:text-white"
                onClick={() => {
                  useAuthStore.getState().setAccessToken(null);
                  router.push("/");
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
