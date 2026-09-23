import { useState } from "react";
import "./App.css";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="movie-list-page">
        <div className="content-container">
          <h1>영화 목록</h1>
          <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <footer className="site-footer">
        <div className="content-container footer-content">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <span>TMDB</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
