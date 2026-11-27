import { Suspense } from "react";
import { StatusMessage } from "@/components/common/status-message";
import { SearchPage } from "@/screens/movies/search-page";

// /search?query=... : 영화 검색 (routes/search.tsx)
// useSearchParams를 쓰는 컴포넌트는 Suspense로 감싸야 빌드할 때 나머지 화면을 미리 만들 수 있어요.
export default function Page() {
  return (
    <Suspense fallback={<StatusMessage>검색 화면을 불러오는 중이에요.</StatusMessage>}>
      <SearchPage />
    </Suspense>
  );
}
