import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
    validateSearch: (search: Record<string, unknown>) => ({
        page: Number.isInteger(Number(search.page)) && Number(search.page) > 0
            ? Math.min(Number(search.page), 500) : 1,
    }),
    component: MovieListPage,
});
