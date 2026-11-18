import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { apiErrorMessage } from "../api/api-client";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
  type Rating,
} from "../api/members/ratings";
import { useAuthStore } from "../stores/auth-store";

function memberIdForPublicRatings(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    // This claim only selects a public list. The backend authorizes writes.
    const payload: unknown = JSON.parse(atob(segment.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload === "object" && payload !== null && "sub" in payload &&
        typeof payload.sub === "number" && Number.isSafeInteger(payload.sub) && payload.sub > 0) {
      return payload.sub;
    }
  } catch {
    return null;
  }
  return null;
}

export function MovieRating({ movieId }: { movieId: number }) {
  const { accessToken, sessionVersion } = useAuthStore();
  const memberId = accessToken ? memberIdForPublicRatings(accessToken) : null;

  return (
    <section aria-labelledby="movie-rating-heading" className="mt-10 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 id="movie-rating-heading" className="text-xl font-bold">내 평점</h2>
      {accessToken && memberId !== null ? (
        <MemberMovieRating key={`${sessionVersion}:${movieId}`}
          token={accessToken} memberId={memberId} movieId={movieId} sessionVersion={sessionVersion} />
      ) : (
        <Link to="/login" className="text-blue-400 hover:underline">
          로그인하고 평점 남기기
        </Link>
      )}
    </section>
  );
}

function MemberMovieRating({ token, memberId, movieId, sessionVersion }: {
  token: string;
  memberId: number;
  movieId: number;
  sessionVersion: number;
}) {
  const queryKey = ["member-session", sessionVersion, "ratings", memberId] as const;
  const queryClient = useQueryClient();
  const ratings = useQuery({
    queryKey,
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
  });
  const current = ratings.data?.find((rating) => rating.movieId === movieId);
  const mutation = useMutation({
    mutationFn: async (action: { score: number; comment: string } | "delete") => {
      if (action === "delete") {
        if (current) await deleteRating(token, current.ratingId);
        return null;
      }

      return current
        ? updateRating(token, current.ratingId, action)
        : createRating(token, movieId, action);
    },
    onSuccess: async (saved) => {
      await queryClient.cancelQueries({ queryKey, exact: true });
      if (useAuthStore.getState().sessionVersion !== sessionVersion) return;
      queryClient.setQueryData<Rating[]>(queryKey, (previous) => {
        const otherRatings = (previous ?? []).filter((rating) => rating.movieId !== movieId);
        return saved ? [saved, ...otherRatings] : otherRatings;
      });
      await queryClient.invalidateQueries({ queryKey, exact: true });
    },
    onError: (error) => {
      if (isHTTPError(error) && [403, 404, 409].includes(error.response.status)) {
        void queryClient.invalidateQueries({ queryKey, exact: true });
      }
    },
  });

  if (!ratings.data) {
    if (!ratings.isError) return <p role="status">평점을 불러오는 중이에요.</p>;

    return (
      <div role="alert" className="space-y-2 text-red-400">
        <p>{apiErrorMessage(ratings.error, "평점을 불러오지 못했어요.")}</p>
        <button type="button" onClick={() => void ratings.refetch()} className="text-white underline">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      {current && <p className="whitespace-pre-wrap text-zinc-300">{current.score} / 5{current.comment ? ` · ${current.comment}` : ""}</p>}
      <RatingForm key={JSON.stringify(current ?? null)} rating={current} pending={mutation.isPending}
        onSave={(input) => mutation.mutate(input)} onDelete={() => mutation.mutate("delete")} />
      {mutation.isError && (
        <p role="alert" className="text-sm text-red-400">
          {apiErrorMessage(mutation.error, "평점을 저장하지 못했어요. 다시 시도해 주세요.")}
        </p>
      )}
    </>
  );
}

function RatingForm({ rating, pending, onSave, onDelete }: {
  rating: Rating | undefined;
  pending: boolean;
  onSave: (input: { score: number; comment: string }) => void;
  onDelete: () => void;
}) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pending) onSave({ score, comment: comment.trim() });
  }

  return (
    <form onSubmit={submit}>
      <fieldset disabled={pending} className="space-y-4 disabled:opacity-60">
        <label className="flex items-center gap-3">
          점수
          <select value={score} onChange={(event) => setScore(Number(event.target.value))}
            className="rounded border border-zinc-700 bg-zinc-800 p-2">
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}점</option>)}
          </select>
        </label>
        <label className="block space-y-2">
          <span>한줄평</span>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)}
            maxLength={500} rows={3} className="w-full rounded border border-zinc-700 bg-zinc-800 p-3" />
        </label>
        <div className="flex gap-3">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2">
            {pending ? "처리 중…" : rating ? "평점 수정" : "평점 등록"}
          </button>
          {rating && (
            <button type="button" onClick={onDelete} className="rounded border border-zinc-600 px-4 py-2">
              삭제
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
