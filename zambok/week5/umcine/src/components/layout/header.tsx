import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-white"
        >
          UMCine
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            영화
          </Link>

          <Link
            to="/search"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            검색
          </Link>
        </nav>
      </div>
    </header>
  );
}