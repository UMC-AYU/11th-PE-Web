import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});
import { useEffect, useState } from "react";
import axios from "axios"; // 또는 fetch 사용

function Index() {
  // 1. 영화 데이터 상태 관리 및 API 호출 (또는 더미 데이터)
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // API 호출 로직
  }, []);

  return (
    <div className="movie-container">
      {/* 2. 영화 목록 렌더링 */}
      {movies.map((movie) => (
        <div key={movie.id}>
          <img
            src={`https://image.tmdb.org/t Scaled.../${movie.poster_path}`}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
}
