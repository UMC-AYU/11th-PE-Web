export function Footer() {
    return (
        <footer className="h-[60px] shrink-0 border-t border-[#e6e9ee] bg-white">
            <div className="mx-auto flex h-full w-[min(1280px,calc(100%-160px))] items-center justify-end gap-2 max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
                <img
                    className="w-[30px]"
                    src="/images/logos/tmdb-logo.svg"
                    alt="TMDB"
                />
                <p className="text-xs leading-[1.4] text-[#747c8a]">
                    This product uses the TMDB API but is not endorsed or
                    certified by <span>TMDB</span>.
                </p>
            </div>
        </footer>
    );
}
