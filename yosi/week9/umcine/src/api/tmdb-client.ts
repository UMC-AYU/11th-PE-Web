import ky from "ky";
import { env } from "@/config/env";

export const TMDB_LANGUAGE = "ko-KR";

// 모든 TMDB 요청에 반복되던 base URL과 인증 헤더를 한곳에 모아요.
export const tmdbClient = ky.create({
  prefix: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.tmdbToken}`,
  },
});
