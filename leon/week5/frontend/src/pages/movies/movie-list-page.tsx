import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieError, getPopularMovies, type MoviePage } from "../../api/tmdb";
import { LoadState } from "../../components/movies/load-state";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

const listRoute = getRouteApi("/");

export function MovieListPage() {
    const { page } = listRoute.useSearch();
    const navigate = useNavigate({ from: "/" });
    const [retry, setRetry] = useState(0);
    const requestKey = `${page}:${retry}`;
    const [result, setResult] = useState<{ key: string; data: MoviePage | null; error: string | null }>({ key: "", data: null, error: null });
    const loading = result.key !== requestKey;
    const data = loading ? null : result.data;
    const error = loading ? null : result.error;

    useEffect(() => {
        const controller = new AbortController();
        getPopularMovies(page, controller.signal)
            .then((data) => {
                if (!controller.signal.aborted) setResult({ key: requestKey, data, error: null });
            })
            .catch((cause: unknown) => {
                if (!controller.signal.aborted) setResult({ key: requestKey, data: null, error: getMovieError(cause) });
            });
        return () => controller.abort();
    }, [page, requestKey]);

    return (
        <main className="flex-1 bg-[#f7f8fa] py-5 pb-10 sm:py-[26px] sm:pb-14">
            <div className="mx-auto w-[min(1280px,calc(100%-160px))] max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
                <h1 className="mt-0 mb-[18px] text-[28px] leading-[1.3] font-extrabold tracking-[-1.4px] text-[#17191f] sm:mb-[22px] sm:text-[34px] sm:tracking-[-1.8px]">
                    영화 목록
                </h1>
                {loading ? <LoadState message="영화 목록을 불러오는 중이에요." loading />
                    : error ? <LoadState message={error} onRetry={() => setRetry((value) => value + 1)} />
                    : data?.movies.length ? <>
                        <MovieGrid movies={data.movies} />
                        <Pagination currentPage={page} totalPages={data.totalPages}
                            onPageChange={(nextPage) => void navigate({ search: { page: nextPage } })} />
                    </> : <LoadState message="표시할 영화가 없어요." />}
            </div>
        </main>
    );
}
