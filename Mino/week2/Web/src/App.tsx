import { useMemo, useState } from 'react'
import './App.css'
import { Header } from './components/movie-list/header'
import { MovieGrid } from './components/movie-list/movie-grid'
import { Pagination } from './components/movie-list/pagination'
import { movies } from './data/movies'

const moviesPerPage = 10

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(movies.map((movie) => [movie.id, movie.isBookmarked])),
  )

  const totalPages = Math.ceil(movies.length / moviesPerPage)

  const visibleMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage
    return movies.slice(startIndex, startIndex + moviesPerPage)
  }, [currentPage])

  const handleBookmarkToggle = (movieId: number) => {
    setBookmarks((currentBookmarks) => ({
      ...currentBookmarks,
      [movieId]: !currentBookmarks[movieId],
    }))
  }

  return (
    <div className="movie-page">
      <Header />
      <main className="movie-page__main">
        <section className="movie-page__content" aria-labelledby="movie-list-title">
          <h1 id="movie-list-title">영화 목록</h1>
          <MovieGrid
            movies={visibleMovies}
            bookmarks={bookmarks}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <footer className="movie-page__footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </div>
  )
}

export default App
