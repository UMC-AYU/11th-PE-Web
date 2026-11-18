import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
    validateSearch: (search: Record<string, unknown>) => ({
        query: typeof search.query === "string" ? search.query : "",
        page: Number.isInteger(Number(search.page)) && Number(search.page) > 0
            ? Math.min(Number(search.page), 500) : 1,
    }),
    component: SearchPage,
});
