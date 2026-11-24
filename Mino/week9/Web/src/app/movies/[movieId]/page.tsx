import type { Metadata } from "next";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

export default async function MoviePage({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
