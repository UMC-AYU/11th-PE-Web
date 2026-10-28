import { getRouteApi, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const movieDetailRoute = getRouteApi("/movies/$movieId");

export function MovieDetailPage() {
    const { movieId } = movieDetailRoute.useParams();
    const [rating, setRating] = useState(0);
    const movie = movies.find((item) => String(item.id) === movieId);

    if (!movie) {
        return (
            <main className="grid min-h-[calc(100vh-150px)] flex-1 place-items-center bg-[#f7f8fa] px-6 text-center">
                <div>
                    <p className="mb-6 text-xl font-bold text-[#596170]">
                        영화를 찾을 수 없어요.
                    </p>
                    <Link
                        className="inline-flex h-11 items-center rounded-lg bg-[#2f6ce5] px-5 text-sm font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35"
                        to="/"
                    >
                        영화 목록으로
                    </Link>
                </div>
            </main>
        );
    }

    function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <main className="flex flex-1 flex-col bg-[#f7f8fa]">
            <section className="relative h-[365px] shrink-0 overflow-hidden text-white">
                <img
                    className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
                    src={movie.backdropPath}
                    alt=""
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,14,19,0.78)_0%,rgba(11,14,19,0.48)_45%,rgba(11,14,19,0.08)_100%)]" />

                <div className="relative mx-auto h-full w-[min(1280px,calc(100%-160px))] max-lg:w-[calc(100%-48px)] max-sm:w-[calc(100%-32px)]">
                    <Link
                        className="absolute top-[27px] left-0 inline-flex items-center gap-2 text-sm font-bold text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                        to="/"
                    >
                        <img
                            className="size-5 brightness-0 invert"
                            src="/icons/chevron-left.svg"
                            alt=""
                        />
                        영화 목록
                    </Link>

                    <div className="absolute right-0 bottom-6 left-0">
                        <h1 className="mb-2 text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] drop-shadow-sm max-sm:text-[30px]">
                            {movie.title}
                        </h1>
                        <p className="mb-2 text-sm text-white/90">
                            {movie.originalTitle}
                        </p>
                        <p className="flex flex-wrap items-center gap-x-2 text-sm font-bold">
                            <span>{movie.releaseDate}</span>
                            <span>{movie.genres.join(" · ")}</span>
                            <span>{movie.runtime}</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-[min(1280px,calc(100%-160px))] flex-1 grid-cols-[200px_minmax(0,1fr)_360px] items-start gap-8 py-6 max-xl:grid-cols-[180px_minmax(0,1fr)_320px] max-lg:w-[calc(100%-48px)] max-lg:grid-cols-[180px_minmax(0,1fr)] max-sm:w-[calc(100%-32px)] max-sm:grid-cols-1">
                <img
                    className="h-72 w-[200px] rounded-[10px] object-cover shadow-[0_12px_28px_rgba(23,25,31,0.12)] max-xl:w-[180px] max-sm:h-auto max-sm:w-[150px]"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                />

                <div className="min-w-0 pt-0.5">
                    <h2 className="mb-3 text-xl font-extrabold tracking-[-0.6px] text-[#20232a]">
                        {movie.tagline}
                    </h2>
                    <p className="mb-4 max-w-[690px] whitespace-pre-line text-[14px] leading-[1.9] text-[#69717e]">
                        {movie.overview}
                    </p>
                    <BookmarkButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                        variant="detail"
                    />
                </div>

                <form
                    className="min-h-[297px] border-l border-[#dfe3e8] pl-8 max-lg:col-span-2 max-lg:border-t max-lg:border-l-0 max-lg:pt-6 max-lg:pl-0 max-sm:col-span-1"
                    onSubmit={handleReviewSubmit}
                >
                    <h2 className="mb-1 text-xl font-extrabold tracking-[-0.6px] text-[#20232a]">
                        내 평점
                    </h2>
                    <p className="mb-2 text-xs text-[#9ba3af]">
                        별점은 필수, 후기는 선택이에요.
                    </p>

                    <fieldset
                        className="mb-2 flex gap-1.5"
                        aria-label="별점 선택"
                    >
                        <legend className="sr-only">별점</legend>
                        {Array.from({ length: 5 }, (_, index) => {
                            const score = index + 1;
                            const isSelected = score <= rating;

                            return (
                                <button
                                    className="grid size-10 cursor-pointer place-items-center rounded-lg border border-[#dce1e8] bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ce5]/30"
                                    key={score}
                                    type="button"
                                    aria-label={`${score}점`}
                                    aria-pressed={rating === score}
                                    onClick={() => setRating(score)}
                                >
                                    <img
                                        className={cn(
                                            "size-6 opacity-70",
                                            isSelected && "opacity-100",
                                        )}
                                        src={
                                            isSelected
                                                ? "/icons/star.svg"
                                                : "/icons/star-outline.svg"
                                        }
                                        alt=""
                                    />
                                </button>
                            );
                        })}
                    </fieldset>

                    <label className="sr-only" htmlFor="movie-review">
                        영화 후기
                    </label>
                    <textarea
                        id="movie-review"
                        className="mb-2 h-[102px] w-full resize-none rounded-lg border border-[#dce1e8] bg-white p-3 text-sm text-[#25282f] outline-none placeholder:text-[#a3abb7] focus:border-[#2f6ce5] focus:ring-3 focus:ring-[#2f6ce5]/10"
                        placeholder="영화를 보고 느낀 점을 남겨보세요."
                    />
                    <button
                        className="h-10 w-full cursor-pointer rounded-lg border-0 bg-[#17191f] text-sm font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#17191f]/30"
                        type="submit"
                    >
                        평점 저장
                    </button>
                </form>
            </section>
        </main>
    );
}
