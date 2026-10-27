import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import type { TmdbMovieDetail } from "../../api/movies/models";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    // 1. 유효하지 않은 영화 ID 차단
    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    async function loadMovieDetail() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) {
          // 2. 404 에러 등 API 실패 시 유틸리티 함수로 에러 문구 설정
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (isLoading) {
    return (
      <main style={{ padding: "20px" }}>영화 정보를 불러오는 중이에요...</main>
    );
  }

  if (errorMessage) {
    return <main style={{ padding: "20px" }}>{errorMessage}</main>;
  }

  if (!movie) {
    return <main style={{ padding: "20px" }}>영화 정보가 없어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main style={{ padding: "20px" }}>
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt="배경 이미지"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            style={{ width: "250px", borderRadius: "8px" }}
          />
        ) : (
          <div
            style={{
              width: "250px",
              height: "375px",
              backgroundColor: "#ccc",
              borderRadius: "8px",
            }}
          >
            이미지 없음
          </div>
        )}
        <div>
          <h1 style={{ margin: "0 0 10px 0" }}>{movie.title}</h1>
          <p style={{ color: "gray", marginTop: 0 }}>{movie.original_title}</p>
          <p>
            <strong>개봉일:</strong> {movie.release_date}
          </p>
          <p>
            <strong>평점:</strong> ⭐️ {movie.vote_average}
          </p>
          <p>
            <strong>장르:</strong> {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p>
            <strong>상영 시간:</strong>{" "}
            {movie.runtime ? `${movie.runtime}분` : "정보 없음"}
          </p>
          {movie.tagline && (
            <p>
              <em>"{movie.tagline}"</em>
            </p>
          )}
          <p>{movie.overview}</p>
        </div>
      </div>
    </main>
  );
}
