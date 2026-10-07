import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store"; // 경로 확인 필요

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  // Zustand 스토어에서 해당 영화의 북마크 여부 및 토글 함수 가져오기
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="movie-card">
      <img src={movie.posterPath} alt={movie.title} className="poster" />
      <div className="info">
        <h3>{movie.title}</h3>
        <p>{movie.releaseDate}</p>
        <button
          type="button"
          aria-pressed={isBookmarked}
          onClick={() => toggleBookmark(movie.id)}
        >
          {isBookmarked ? "★북마크 해제" : "☆북마크 추가"}
        </button>
      </div>
    </article>
  );
}
