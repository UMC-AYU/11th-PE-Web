import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });

    const [searchText, setSearchText] = useState(query ?? "");

    useEffect(() => {
        setSearchText(query ?? "");
    }, [query]);

    const normalizedQuery = query?.trim().toLowerCase() ?? "";

    const searchResults = normalizedQuery
        ? movies.filter(
            (movie) =>
                movie.title.toLowerCase().includes(normalizedQuery) ||
                movie.originalTitle.toLowerCase().includes(normalizedQuery),
        )
        : [];

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextQuery = searchText.trim();

        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <section className="mx-auto max-w-3xl">
                <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-blue-400">
                    SEARCH
                </p>

                <h1 className="text-4xl font-black tracking-tight">
                    영화 검색
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex gap-3"
                >
                    <input
                        aria-label="검색어"
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="영화 제목을 입력하세요"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-6 font-bold text-white transition hover:bg-blue-500"
                    >
                        검색
                    </button>
                </form>
            </section>

            {!normalizedQuery ? (
                <div className="py-24 text-center text-zinc-500">
                    검색어를 입력해 주세요.
                </div>
            ) : (
                <section className="mt-14">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">
                            ‘{query}’ 검색 결과
                        </h2>

                        <p className="mt-2 text-sm text-zinc-500">
                            영화 {searchResults.length}편
                        </p>
                    </div>

                    {searchResults.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center text-zinc-500">
                            검색 결과가 없어요.
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {searchResults.map((movie) => (
                                <article
                                    key={movie.id}
                                    className="flex gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
                                >
                                    <Link
                                        to="/movies/$movieId"
                                        params={{ movieId: String(movie.id) }}
                                        className="shrink-0"
                                    >
                                        <img
                                            src={movie.posterPath}
                                            alt={`${movie.title} 포스터`}
                                            className="h-48 w-32 rounded-lg object-cover"
                                        />
                                    </Link>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <h3 className="text-xl font-bold">
                                            {movie.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            {movie.originalTitle}
                                        </p>

                                        <p className="mt-3 text-sm text-zinc-400">
                                            {movie.releaseDate}
                                        </p>

                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
                                            {movie.overview}
                                        </p>

                                        <Link
                                            to="/movies/$movieId"
                                            params={{ movieId: String(movie.id) }}
                                            className="mt-auto pt-5 text-sm font-semibold text-blue-400 hover:text-blue-300"
                                        >
                                            상세 보기 →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}