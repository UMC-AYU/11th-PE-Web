import { createContext, useContext } from "react";
import type { Movie } from "../types/movie";

export interface MovieContextValue {
  movies: Movie[];
  toggleBookmark: (movieId: number) => void;
}

export const MovieContext = createContext<MovieContextValue | null>(null);

export function useMovies() {
  const value = useContext(MovieContext);

  if (!value) {
    throw new Error("useMovies must be used inside MovieContext.Provider");
  }

  return value;
}
