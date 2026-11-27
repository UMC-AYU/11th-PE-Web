import { Suspense } from "react";
import { StatusMessage } from "@/components/common/status-message";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

// /movies/155 : 영화 상세 (routes/movies.$movieId.tsx → [movieId] 폴더)
// 화면 안에서 useParams로 movieId를 읽어요. 주소에서 읽는 값은 요청이 와야 알 수 있어서 Suspense로 감싸요.
export default function Page() {
  return (
    <Suspense fallback={<StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>}>
      <MovieDetailPage />
    </Suspense>
  );
}
