import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
    const { movieId } = useParams({
        from: "/movies/$movieId",
    });

    const movie = movies.find(
        (item) => item.id === Number(movieId),
    );

    if (!movie) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                <p className="text-6xl font-black text-zinc-800">404</p>

                <h1 className="mt-5 text-2xl font-bold">
                    영화를 찾을 수 없어요.
                </h1>

                <Link
                    to="/"
                    className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
                >
                    영화 목록으로 돌아가기
                </Link>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen">
            <section className="relative overflow-hidden">
                <img
                    src={movie.backdropPath}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/75 to-black/30" />

                <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-zinc-300 transition hover:text-white"
                    >
                        ← 영화 목록
                    </Link>

                    <div className="mt-12 grid gap-10 md:grid-cols-[260px_1fr] md:items-end">
                        <img
                            src={movie.posterPath}
                            alt={`${movie.title} 포스터`}
                            className="w-full max-w-[260px] rounded-2xl object-cover shadow-2xl shadow-black/60"
                        />

                        <div>
                            <p className="text-sm font-medium text-blue-400">
                                {movie.releaseDate}
                            </p>

                            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                {movie.title}
                            </h1>

                            <p className="mt-3 text-lg text-zinc-400">
                                {movie.originalTitle}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                                <span>{movie.genres.join(" · ")}</span>
                                <span className="text-zinc-600">|</span>
                                <span>{movie.runtime}</span>
                            </div>

                            <h2 className="mt-10 text-2xl font-bold">
                                {movie.tagline}
                            </h2>

                            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
                                {movie.overview}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}