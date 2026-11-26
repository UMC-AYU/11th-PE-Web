import { SearchPage } from "../../views/movies/search-page";
export const metadata = { title: "영화 검색" };

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query.trim() : "";
  return <SearchPage key={query} initialQuery={query} />;
}
