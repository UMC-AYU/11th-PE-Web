import { Suspense } from "react";
import { SearchPage } from "@/src/features/movies/search-page";

type SearchPageProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export default function Page({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<main role="status">검색 페이지를 준비하는 중이에요.</main>}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;

  return <SearchPage query={typeof query === "string" ? query : undefined} />;
}