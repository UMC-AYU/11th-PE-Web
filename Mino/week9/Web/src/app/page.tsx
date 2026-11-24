import MovieListPage from "../screens/movies/movie-list-page";
import { parsePage, type PageSearchParams } from "../utils/search-params";

export default async function HomePage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const search = await searchParams;
  return <MovieListPage page={parsePage(search.page)} />;
}
