import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
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
    ? movies.filter((movie) => {
        const title = movie.title.toLowerCase();
        const originalTitle = movie.originalTitle.toLowerCase();

        return (
          title.includes(normalizedQuery) ||
          originalTitle.includes(normalizedQuery)
        );
      })
    : [];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-10">
        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-blue-400">
          SEARCH
        </p>

        <h1 className="text-4xl font-black tracking-tight text-white">
          영화 검색
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          제목 또는 원제로 영화를 검색해 보세요.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mb-10 flex gap-3"
      >
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-zinc-500">
          검색어를 입력해 주세요.
        </div>
      ) : searchResults.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <p className="text-lg font-semibold text-white">
            검색 결과가 없습니다.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            다른 검색어를 입력해 보세요.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-zinc-500">
            "{query}" 검색 결과 {searchResults.length}개
          </p>

          <div className="space-y-5">
            {searchResults.map((movie) => (
              <article
                key={movie.id}
                className="relative flex gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
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

                <div className="flex min-w-0 flex-1 flex-col pr-12">
                  <h3 className="text-xl font-bold text-white">
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

                <BookmarkButton
                  movieId={movie.id}
                  className="absolute top-5 right-5"
                />
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}