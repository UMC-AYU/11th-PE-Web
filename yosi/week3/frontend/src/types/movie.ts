export type Movie = {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime: number;
  tagline: string;
  isBookmarked: boolean;
};
