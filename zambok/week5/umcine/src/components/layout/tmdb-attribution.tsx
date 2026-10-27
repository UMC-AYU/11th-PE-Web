export function TmdbAttribution() {
  return (
    <footer className="mx-auto w-full max-w-7xl px-6 py-8 text-xs text-zinc-400">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB (The Movie Database)"
        className="mb-3 h-auto w-32"
      />
      <p>영화 정보 제공: TMDB (The Movie Database).</p>
      <p className="mt-1">이 서비스는 TMDB의 승인이나 보증을 받지 않았습니다.</p>
    </footer>
  );
}
