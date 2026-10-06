import { useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find(
    (movie) => movie.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h1 className="text-2xl font-bold text-white">
            영화를 찾을 수 없어요.
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            존재하지 않는 영화입니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-end px-6 py-12">
          <div className="flex w-full flex-col gap-8 md:flex-row md:items-end">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-44 rounded-xl object-cover shadow-2xl md:w-52"
            />

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm text-zinc-400">
                {movie.originalTitle}
              </p>

              <div className="flex items-start justify-between gap-5">
                <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                  {movie.title}
                </h1>

                <BookmarkButton
                  movieId={movie.id}
                  className="shrink-0"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <span>{movie.releaseDate}</span>
                <span className="text-zinc-600">•</span>
                <span>{movie.runtime}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {movie.tagline && (
          <p className="mb-6 text-xl font-medium italic text-zinc-300">
            "{movie.tagline}"
          </p>
        )}

        <div>
          <h2 className="text-xl font-bold text-white">
            줄거리
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-zinc-400">
            {movie.overview}
          </p>
        </div>
      </section>
    </main>
  );
}