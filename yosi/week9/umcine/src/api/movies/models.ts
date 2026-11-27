export type TmdbPaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieListItem = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbMovieDetail = Omit<TmdbMovieListItem, "genre_ids"> & {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
};

export type GetMoviesParams = {
  page?: number;
};

export type SearchMoviesParams = {
  query: string;
  page?: number;
};
