import type { Movie } from "../../types/movie";
import type { TmdbMovieDetail, TmdbMovieListItem } from "./models";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const fallbackImage = "/icons/movie.svg";

const genreNames: Record<number, string> = {
  12: "모험",
  14: "판타지",
  16: "애니메이션",
  18: "드라마",
  27: "공포",
  28: "액션",
  35: "코미디",
  36: "역사",
  37: "서부",
  53: "스릴러",
  80: "범죄",
  99: "다큐멘터리",
  878: "SF",
  9648: "미스터리",
  10402: "음악",
  10749: "로맨스",
  10751: "가족",
  10752: "전쟁",
  10770: "TV 영화",
};

function formatReleaseDate(releaseDate: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 미정";
}

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보 없음";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function imageUrl(path: string | null, size: "w500" | "w1280") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : fallbackImage;
}

function adaptTmdbMovieListItem(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatReleaseDate(movie.release_date),
    posterPath: imageUrl(movie.poster_path, "w500"),
    backdropPath: imageUrl(movie.backdrop_path, "w1280"),
    genres: movie.genre_ids.map((id) => genreNames[id]).filter(Boolean),
    runtime: "상세 정보에서 확인",
    tagline: "",
    overview: movie.overview || "줄거리 정보가 없어요.",
  };
}

function adaptTmdbMovieDetail(movie: TmdbMovieDetail): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatReleaseDate(movie.release_date),
    posterPath: imageUrl(movie.poster_path, "w500"),
    backdropPath: imageUrl(movie.backdrop_path, "w1280"),
    genres: movie.genres.map((genre) => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline || movie.title,
    overview: movie.overview || "줄거리 정보가 없어요.",
  };
}

export { adaptTmdbMovieDetail, adaptTmdbMovieListItem };
