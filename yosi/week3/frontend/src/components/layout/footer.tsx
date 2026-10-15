export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <p className="mx-auto max-w-6xl px-6 py-5 text-right text-xs text-gray-500">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
