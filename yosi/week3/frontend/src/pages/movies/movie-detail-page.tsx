import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { formatDate, formatRuntime } from "../../utils/format";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);

  if (!movie) {
    return <main className="py-32 text-center text-gray-500">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <section className="relative h-[420px] overflow-hidden bg-gray-900 text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col px-6 py-6">
          <Link to="/" className="flex w-fit items-center gap-1 text-xs font-semibold">
            <img src="/icons/chevron-left.svg" alt="" aria-hidden="true" className="size-5 invert" />
            영화 목록
          </Link>
          <div className="mt-auto pb-6">
            <h1 className="text-5xl font-extrabold">{movie.title}</h1>
            <p className="mt-3 text-sm text-gray-200">{movie.originalTitle}</p>
            <p className="mt-3 text-sm font-semibold">
              {formatDate(movie.releaseDate)} · {movie.genres.join(" · ")} ·{" "}
              {formatRuntime(movie.runtime)}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_280px]">
        <section className="flex gap-8">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-40 shrink-0 rounded-[10px] bg-gray-200 object-cover shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold">{movie.tagline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{movie.overview}</p>
            <button
              type="button"
              className="mt-5 flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <img
                src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                aria-hidden="true"
                className="size-4 invert"
              />
              {movie.isBookmarked ? "찜 완료" : "찜하기"}
            </button>
          </div>
        </section>

        <aside className="border-gray-200 lg:border-l lg:pl-8">
          <h2 className="font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-400">별점을 눌러 평가를 남겨보세요.</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                aria-pressed={rating === score}
                onClick={() => setRating(score)}
              >
                <img
                  src={score <= rating ? "/icons/star.svg" : "/icons/star-outline.svg"}
                  alt=""
                  aria-hidden="true"
                  className={cn("size-6", score > rating && "opacity-40")}
                />
              </button>
            ))}
          </div>
          <label htmlFor="review" className="sr-only">
            한줄평
          </label>
          <textarea
            id="review"
            rows={4}
            placeholder="영화에 대한 느낌을 남겨주세요."
            className="mt-4 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none focus:border-gray-400"
          />
          <button
            type="button"
            className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-xs font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}
