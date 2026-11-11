import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieError, getPopularMovies } from "../../api/tmdb";
import { LoadState } from "../../components/movies/load-state";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

const listRoute = getRouteApi("/");

export function MovieListPage() {
    const { page } = listRoute.useSearch();
    const navigate = useNavigate({ from: "/" });
    const moviesQuery = useQuery({
        queryKey: ["movies", "list", { page }],
        queryFn: ({ signal }) => getPopularMovies(page, signal),
    });
    const data = moviesQuery.data;

    return (
        <main className="flex-1 bg-[#f7f8fa] py-5 pb-10 sm:py-[26px] sm:pb-14">
            <div className="mx-auto w-[min(1280px,calc(100%-160px))] max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
                <h1 className="mt-0 mb-[18px] text-[28px] leading-[1.3] font-extrabold tracking-[-1.4px] text-[#17191f] sm:mb-[22px] sm:text-[34px] sm:tracking-[-1.8px]">
                    영화 목록
                </h1>
                {moviesQuery.isPending ? <LoadState message="영화 목록을 불러오는 중이에요." loading />
                    : moviesQuery.isError ? <LoadState message={getMovieError(moviesQuery.error)} onRetry={() => void moviesQuery.refetch()} />
                    : data?.movies.length ? <>
                        <MovieGrid movies={data.movies} />
                        <Pagination currentPage={page} totalPages={data.totalPages}
                            onPageChange={(nextPage) => void navigate({ search: { page: nextPage } })} />
                    </> : <LoadState message="표시할 영화가 없어요." />}
            </div>
        </main>
    );
}
