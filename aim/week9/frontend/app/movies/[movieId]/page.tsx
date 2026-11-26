import { Suspense } from "react";
import { MovieDetailPage } from "@/src/features/movies/movie-detail-page";

type MoviePageProps = {
  params: Promise<{ movieId: string }>;
};

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={<main role="status">영화 페이지를 준비하는 중이에요.</main>}>
      <MoviePageContent params={params} />
    </Suspense>
  );
}

async function MoviePageContent({ params }: MoviePageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieIdParam={movieId} />;
}