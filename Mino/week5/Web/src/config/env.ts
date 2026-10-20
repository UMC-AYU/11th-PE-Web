const tmdbApiBaseUrl =
  import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim() || "";

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
};

export function getTmdbAccessToken() {
  const isPlaceholder = /^(YOUR_|REPLACE_|<)|여기에|입력/i.test(
    tmdbAccessToken,
  );
  const isHeaderSafe = /^[\x20-\x7E]+$/.test(tmdbAccessToken);

  if (!tmdbAccessToken || isPlaceholder || !isHeaderSafe) {
    throw new Error(
      ".env.local에 유효한 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요.",
    );
  }

  return tmdbAccessToken;
}
