import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim() ?? "";

    setSearchText(query ?? "");
    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="영화 제목 검색"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="검색어를 입력해 주세요"
        />
        <button type="submit">검색</button>
      </form>

      {!query?.trim() ? (
        <p>검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p>검색 결과를 불러오는 중이에요...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p>검색 결과가 없어요.</p>
      ) : (
        <>
          <h2>검색어 : {query}</h2>
          <p>검색 결과 {movies.length}건</p>
          <MovieGrid movies={movies} />
        </>
      )}
    </main>
  );
}
