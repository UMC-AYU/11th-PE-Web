import { useEffect, useState } from "react";
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
        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main style={{ padding: "20px" }}>영화 목록을 불러오는 중이에요...</main>
    );
  }

  if (errorMessage) {
    return <main style={{ padding: "20px" }}>{errorMessage}</main>;
  }

  if (movies.length === 0) {
    return <main style={{ padding: "20px" }}>조건에 맞는 영화가 없어요.</main>;
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>인기 영화</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
