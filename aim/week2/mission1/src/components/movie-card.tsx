import type { Movie } from '../types/movie'

type MovieCardProps = {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({ //movie, onToggleBookmark props 전달
  movie,
  onToggleBookmark, 
}: MovieCardProps) {
  const bookmarkLabel = movie.isBookmarked ? '북마크 해제' : '북마크 추가'
  const bookmarkIcon = movie.isBookmarked
    ? '/icons/movie-icons/bookmark.svg'
    : '/icons/movie-icons/bookmark-outline.svg'

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="poster" src={movie.posterPath} alt={movie.title} />
        <button
          className="bookmark-button"
          type="button"
          aria-label={`${movie.title} ${bookmarkLabel}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img src={bookmarkIcon} alt="" />
        </button>
      </div>

      <h2>{movie.title}</h2>
      <p>{movie.releaseDate}</p>
    </article>
  )
}
