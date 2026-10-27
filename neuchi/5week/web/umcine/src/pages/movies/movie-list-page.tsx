import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import MovieGrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화를 불러오는데 실패했습니다.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMovies();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      {/* 5주차 미션 전용 페이지 이동 버튼 2개 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
          padding: "15px",
          borderRadius: "12px",
          background: "var(--code-bg)",
        }}
      >
        <Link
          to="/signup"
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          회원가입 페이지 이동
        </Link>
        <Link
          to="/ratings"
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          평점 목록 조회 페이지 이동
        </Link>
      </div>

      <h1>영화 목록</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>영화가 없습니다.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </main>
  );
}
