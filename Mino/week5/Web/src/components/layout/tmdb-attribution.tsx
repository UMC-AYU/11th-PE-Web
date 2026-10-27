export function TmdbAttribution() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl items-center justify-end gap-2 px-4 pt-4 pb-6 text-[10px] leading-tight text-slate-400 md:px-10 xl:px-0">
      <img className="h-[9px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <span className="max-w-[260px] text-right sm:max-w-none">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </span>
    </footer>
  );
}
