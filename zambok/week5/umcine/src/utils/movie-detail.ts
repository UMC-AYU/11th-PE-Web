import { isHTTPError } from "ky";

export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  return "영화 정보를 불러오지 못했어요.";
}

export function formatMovieRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}
