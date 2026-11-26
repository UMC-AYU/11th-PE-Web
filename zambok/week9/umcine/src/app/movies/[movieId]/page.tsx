import { MovieDetailPage } from "../../../views/movies/movie-detail-page";
export const metadata = { title: "영화 상세" };

export default async function Page({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetailPage key={movieId} movieIdParam={movieId} />;
}
