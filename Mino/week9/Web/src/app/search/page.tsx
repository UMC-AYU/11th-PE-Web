import type { Metadata } from "next";
import { SearchPage } from "../../screens/movies/search-page";
import { parsePage, type PageSearchParams } from "../../utils/search-params";

export const metadata: Metadata = { title: "영화 검색" };

export default async function MovieSearchPage({ searchParams }: { searchParams: Promise<PageSearchParams> }) {
  const search = await searchParams;
  const query = typeof search.query === "string" ? search.query : "";
  return <SearchPage query={query} page={parsePage(search.page)} />;
}
