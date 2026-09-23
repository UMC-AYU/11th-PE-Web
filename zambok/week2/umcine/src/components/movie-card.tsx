import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
          className="bookmark-button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p className="original-title">{movie.originalTitle}</p>

        <div className="movie-meta">
          <span>{movie.releaseDate}</span>
          <span>{movie.runtime}</span>
        </div>

        <div className="genres">
          {movie.genres.map((genre) => (
            <span key={genre} className="genre">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}