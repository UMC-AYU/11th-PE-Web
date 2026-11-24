import ky from "ky";

const client = ky.create({ baseUrl: "/api/tmdb/" });

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

export function getPopularMovies(page = 1) {
    return client
        .get("movie/popular", {
            searchParams: {
                language: "ko-KR",
                page,
            },
        })
        .json<MovieListResponse>();
}

export async function searchMovies(query: string) {
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
    return client
        .get(`movie/${movieId}`, {
            searchParams: { language: "ko-KR" },
        })
        .json<TmdbMovieDetail>();
}

export function posterUrl(path: string | null) {
    return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "";
}