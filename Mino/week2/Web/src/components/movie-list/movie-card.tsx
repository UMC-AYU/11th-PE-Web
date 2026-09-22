import type { Movie } from '../../types/movie'

interface MovieCardProps {
  movie: Movie
  isBookmarked: boolean
  onBookmarkToggle: (movieId: number) => void
}

export function MovieCard({
  movie,
  isBookmarked,
  onBookmarkToggle,
}: MovieCardProps) {
  const bookmarkLabel = isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크`

  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        <img className="movie-card__poster" src={movie.posterPath} alt={movie.title} />
        <button
          className={`movie-card__bookmark${
            isBookmarked ? ' movie-card__bookmark--active' : ''
          }`}
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>
      <div className="movie-card__info">
        <h2>{movie.title}</h2>
        <time dateTime={movie.releaseDate.replaceAll('.', '-')}>
          {movie.releaseDate}
        </time>
      </div>
    </article>
  )
}
