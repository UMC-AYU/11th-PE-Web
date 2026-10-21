import MovieGrid from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store"; // 파일 위치가 utils 폴더에 있다면 "../../utils/bookmark-store"로 수정해 주세요.

export function MovieListPage() {
  // 1. Zustand 스토어에서 북마크 ID 목록과 토글 함수를 가져옵니다.
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 2. 초기 영화 목록 데이터에 Zustand의 북마크 여부를 매핑합니다.
  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main style={{ padding: "20px" }}>
      <h1>영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
    </main>
  );
}
