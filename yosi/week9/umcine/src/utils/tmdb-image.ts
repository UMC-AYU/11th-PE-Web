const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(path: string | null, size: "w500" | "w1280" | "original" = "w500") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : undefined;
}
