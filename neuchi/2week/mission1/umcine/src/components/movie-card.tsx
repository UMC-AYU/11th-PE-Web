import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <img src={movie.posterPath} alt={movie.title} className="poster" />
      <div className="info">
        <h3>{movie.title}</h3>
        <p>{movie.releaseDate}</p>
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          {movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        </button>
      </div>
    </article>
  );
}