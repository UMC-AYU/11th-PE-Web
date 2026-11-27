// 환경 변수는 이 파일에서만 읽고, 다른 파일은 env 객체를 가져다 써요.
// Next.js에서는 브라우저에서도 쓰는 값에 NEXT_PUBLIC_ 접두사가 필요해요.
export const env = {
  // TMDB API 인증 토큰
  tmdbToken: process.env.NEXT_PUBLIC_TMDB_TOKEN ?? "",
  // 직접 만든 회원 서버 주소
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
};
