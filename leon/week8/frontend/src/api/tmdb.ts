import ky, { HTTPError } from "ky";
import type { Movie } from "../types/movie";

const baseUrl = import.meta.env.VITE_TMDB_API_BASE_URL?.replace(/\/+$/, "");
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();

interface TmdbMovieSummary {
    id: number;
    title: string;
    original_title: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
}

interface TmdbMovieDetail extends TmdbMovieSummary {
    genres: { id: number; name: string }[];
    runtime: number | null;
    tagline: string;
}

interface TmdbPage {
    page: number;
    results: TmdbMovieSummary[];
    total_pages: number;
    total_results: number;
}

export interface MoviePage {
    movies: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
}

function checkConfig() {
    if (!baseUrl || !accessToken || accessToken === "발급받은_API_READ_ACCESS_TOKEN") {
        throw new Error("TMDB API 토큰을 .env.local에 설정해 주세요.");
    }
}

const tmdb = ky.create({
    prefix: baseUrl,
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    timeout: 15000,
    retry: { limit: 1 },
});

function imageUrl(path: string | null, size: "w500" | "w1280") {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

function toMovie(movie: TmdbMovieSummary): Movie {
    return {
        id: movie.id,
        title: movie.title || movie.original_title,
        originalTitle: movie.original_title,
        releaseDate: movie.release_date ? movie.release_date.replaceAll("-", ".") : "개봉일 미정",
        posterPath: imageUrl(movie.poster_path, "w500"),
        backdropPath: imageUrl(movie.backdrop_path, "w1280"),
        genres: [],
        runtime: "",
        tagline: "",
        overview: movie.overview || "등록된 줄거리가 없어요.",
    };
}

function toPage(data: TmdbPage): MoviePage {
    return {
        movies: data.results.map(toMovie),
        page: data.page,
        totalPages: Math.min(data.total_pages, 500),
        totalResults: data.total_results,
    };
}

export async function getPopularMovies(page: number, signal?: AbortSignal) {
    checkConfig();
    const data = await tmdb.get("movie/popular", {
        searchParams: { language: "ko-KR", page },
        signal,
    }).json<TmdbPage>();
    return toPage(data);
}

export async function searchMovies(query: string, page: number, signal?: AbortSignal) {
    checkConfig();
    const data = await tmdb.get("search/movie", {
        searchParams: { query, language: "ko-KR", page, include_adult: false },
        signal,
    }).json<TmdbPage>();
    return toPage(data);
}

export async function getMovieDetail(id: number, signal?: AbortSignal) {
    checkConfig();
    const data = await tmdb.get(`movie/${id}`, {
        searchParams: { language: "ko-KR" },
        signal,
    }).json<TmdbMovieDetail>();
    const movie = toMovie(data);
    return {
        ...movie,
        genres: data.genres.map((genre) => genre.name),
        runtime: data.runtime ? `${Math.floor(data.runtime / 60)}시간 ${data.runtime % 60}분` : "",
        tagline: data.tagline || "줄거리",
    };
}

export function getMovieError(error: unknown) {
    if (error instanceof Error && error.message.includes(".env.local")) return error.message;
    if (error instanceof HTTPError && error.response.status === 401) return "TMDB 인증에 실패했어요. API 토큰을 확인해 주세요.";
    return "영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export function isNotFound(error: unknown) {
    return error instanceof HTTPError && error.response.status === 404;
}
