// 1. 공통 영화 정보
interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}
// 2. 영화 목록/검색 항목
interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}
// 3. 영화 목록 API 전체 응답
interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}
// 4. 장르 개별 정보
interface TmdbGenre {
  id: number;
  name: string;
}
// 5. 영화 상세 정보
interface TmdbMovieDetail extends TmdbMovie {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}

export type {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
};
