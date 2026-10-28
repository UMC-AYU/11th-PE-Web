import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { MovieContext } from "../../context/movie-context";
import { movies as initialMovies } from "../../data/movies";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  const [movies, setMovies] = useState(initialMovies);

  function toggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#17191f]">
      <Header />
      <MovieContext.Provider value={{ movies, toggleBookmark }}>
        <Outlet />
      </MovieContext.Provider>
      <Footer />
    </div>
  );
}
