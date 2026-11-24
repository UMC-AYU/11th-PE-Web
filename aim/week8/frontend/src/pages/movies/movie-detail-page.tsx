import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { MovieFavoriteButton } from "../../components/movie-favorite-button";
import { MovieRating } from "../../components/movie-rating";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 요청하지 않는 잘못된 ID는 로딩보다 먼저 처리해요.
  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return (
      <main role="status">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main role="alert">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main>
      <div className="aspect-video w-full max-w-[1280px] bg-gray-200">
        {backdropUrl ? (
          <img
            className="h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            이미지 없음
          </div>
        )}
      </div>

      <Link to="/">영화 목록</Link>

      <div className="relative aspect-[2/3] w-[500px] max-w-full bg-gray-200">
        {posterUrl ? (
          <img
            className="block h-full w-full object-cover"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            이미지 없음
          </div>
        )}

        <MovieFavoriteButton
          key={movie.id}
          movieId={movie.id}
          movieTitle={movie.title}
        />
      </div>

      <h1>{movie.title}</h1>
      <p>{movie.original_title}</p>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>{runtimeText}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
      <MovieRating movieId={movie.id} />
    </main>
  );
}