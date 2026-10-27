import ky from "ky";

const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export const isTmdbConfigured = Boolean(token);

function requireToken() {
    if (!token) {
        throw new Error("VITE_TMDB_ACCESS_TOKEN이 없습니다.");
    }
}

const client = ky.create({
    baseUrl: "https://api.themoviedb.org/3/",
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export interface TmdbMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
}

export interface TmdbMovieDetail extends TmdbMovie {
    runtime: number | null;
    tagline: string;
    genres: { id: number; name: string }[];
}

export interface MovieListResponse {
    results: TmdbMovie[];
    page: number;
    total_pages: number;
}

export async function getPopularMovies() {
    requireToken();
    return client
        .get("movie/popular", {
            searchParams: { language: "ko-KR", page: 1 },
        })
        .json<MovieListResponse>();
}

export async function searchMovies(query: string) {
    requireToken();
    return client
        .get("search/movie", {
            searchParams: {
                query,
                language: "ko-KR",
                include_adult: "false",
            },
        })
        .json<MovieListResponse>();
}

export async function getMovieDetail(movieId: number) {
    requireToken();
    return client
        .get(`movie/${movieId}`, {
            searchParams: { language: "ko-KR" },
        })
        .json<TmdbMovieDetail>();
}

export async function testWithFetch() {
    requireToken();
    const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as MovieListResponse;
}

export function posterUrl(path: string | null) {
    return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "";
}