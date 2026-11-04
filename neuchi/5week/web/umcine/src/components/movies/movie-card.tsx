import { Link } from "@tanstack/react-router";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="movie-card">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
      >
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="poster" />
        ) : (
          <div className="poster no-image">이미지 없음</div>
        )}
        <div className="info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date}</p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={(e) => {
              e.preventDefault(); // 북마크 클릭 시 상세 페이지로 넘어가는 것을 막음
              e.stopPropagation(); // 이벤트가 부모(Link)로 전달되는 것을 막음
              toggleBookmark(movie.id);
            }}
          >
            {isBookmarked ? "★ 북마크 해제" : "☆ 북마크 추가"}
          </button>
        </div>
      </Link>
    </article>
  );
}
