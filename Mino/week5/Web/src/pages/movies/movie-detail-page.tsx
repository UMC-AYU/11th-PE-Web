import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getMovieDetail,
  type GetMovieDetailResponse,
} from "../../api/movies/get-movie-detail";
import { adaptTmdbMovieDetail } from "../../api/movies/movie-adapter";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import {
  RequestError,
  RequestLoading,
} from "../../components/movies/request-state";
import { useBookmarkStore } from "../../stores/bookmark-store";

type MovieDetailState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: GetMovieDetailResponse };

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const numericMovieId = Number(movieId);
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<MovieDetailState>({ status: "loading" });
  const bookmarkedMovieIds = useBookmarkStore(
    (store) => store.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((store) => store.toggleBookmark);

  useEffect(() => {
    if (!Number.isInteger(numericMovieId) || numericMovieId <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "error", message: "올바른 영화 ID가 아니에요." });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    getMovieDetail(numericMovieId, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했어요.",
          });
        }
      });

    return () => controller.abort();
  }, [numericMovieId, requestVersion]);

  if (state.status === "loading") {
    return (
      <main className="flex-1">
        <RequestLoading label="영화 상세 정보를 불러오는 중이에요." />
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-10">
        <RequestError
          message={state.message}
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      </main>
    );
  }

  const movie = adaptTmdbMovieDetail(state.data);
  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  return (
    <main className="flex-1 bg-[#f5f6f8] pb-20">
      <section className="relative isolate min-h-[360px] overflow-hidden bg-slate-950 md:min-h-[440px]">
        <img className="absolute inset-0 -z-20 size-full object-cover object-center" src={movie.backdropPath} alt="" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
        <div className="mx-auto flex min-h-[360px] w-full max-w-7xl items-end px-4 pt-16 pb-12 md:min-h-[440px] md:px-10 md:pb-16 xl:px-0">
          <div className="max-w-2xl text-white">
            <Link className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-white/75 no-underline hover:text-white" to="/">
              <img className="size-4 invert" src="/icons/chevron-left.svg" alt="" />영화 목록
            </Link>
            <p className="mb-2 text-sm font-semibold tracking-wide text-white/65">{movie.originalTitle}</p>
            <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-5xl">{movie.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-white/80">
              <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
              {movie.genres.length > 0 ? (
                <>
                  <span className="size-1 rounded-full bg-white/40" />
                  <span>{movie.genres.join(" · ")}</span>
                </>
              ) : null}
              <span className="size-1 rounded-full bg-white/40" />
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pt-10 md:grid-cols-[220px_minmax(0,1fr)] md:px-10 xl:px-0">
        <img className="hidden aspect-[2/3] w-full rounded-lg bg-slate-200 object-cover shadow-[0_14px_34px_rgba(15,23,42,0.25)] md:block" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <div className="min-w-0 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#1e88ff]">영화 정보</p>
              <h2 className="mt-2 text-2xl font-extrabold">{movie.tagline}</h2>
            </div>
            <BookmarkButton className="size-10 shrink-0 rounded-full border-slate-200 bg-white" movieTitle={movie.title} isBookmarked={isBookmarked} onToggle={() => toggleBookmark(movie.id)} />
          </div>
          <p className="mt-6 text-[15px] leading-7 text-slate-600">{movie.overview}</p>
          <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-6 text-sm sm:grid-cols-3">
            <div><dt className="font-semibold text-slate-400">개봉일</dt><dd className="mt-1 font-bold text-slate-700">{movie.releaseDate}</dd></div>
            <div><dt className="font-semibold text-slate-400">장르</dt><dd className="mt-1 font-bold text-slate-700">{movie.genres.join(", ") || "장르 정보 없음"}</dd></div>
            <div><dt className="font-semibold text-slate-400">상영 시간</dt><dd className="mt-1 font-bold text-slate-700">{movie.runtime}</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
