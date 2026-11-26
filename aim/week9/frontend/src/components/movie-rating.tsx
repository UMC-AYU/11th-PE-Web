"use client";

import Link from "next/link";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { deleteRating, updateRating } from "../api/ratings/change-rating";
import { createRating } from "../api/ratings/create-rating";
import {
  getMemberRatings,
  type Rating,
} from "../api/ratings/get-member-ratings";
import { useHydrated } from "../hooks/use-hydrated";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/get-member-id-from-token";

function memberRatingsKey(memberId: string | null) {
  return ["ratings", "member", memberId] as const;
}

export function MovieRating({ movieId }: { movieId: number }) {
  const isHydrated = useHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = isHydrated ? getMemberIdFromToken(accessToken) : null;

  const ratingsQuery = useQuery({
    queryKey: memberRatingsKey(memberId),
    queryFn: memberId ? () => getMemberRatings(memberId) : skipToken,
    retry: false,
  });

  const rating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  if (!isHydrated) return null;

  return (
    <section className="my-6 space-y-2 px-4" aria-labelledby="movie-rating-title">
      <h2 id="movie-rating-title" className="text-lg font-semibold">
        내 평점
      </h2>

      {!accessToken ? (
        <Link href="/login" className="text-blue-600 underline">
          로그인하면 내 평점을 남길 수 있어요.
        </Link>
      ) : !memberId ? (
        <p role="alert">회원 정보를 확인하지 못했어요.</p>
      ) : ratingsQuery.isPending ? (
        <p role="status">평점을 불러오는 중이에요.</p>
      ) : ratingsQuery.isError ? (
        <p role="alert">평점을 불러오지 못했어요.</p>
      ) : (
        <RatingControls
          key={`${memberId}:${movieId}:${rating?.ratingId ?? "new"}`}
          movieId={movieId}
          memberId={memberId}
          rating={rating}
        />
      )}
    </section>
  );
}

function RatingControls({
  movieId,
  memberId,
  rating,
}: {
  movieId: number;
  memberId: string;
  rating: Rating | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  function refreshRatings() {
    return queryClient.invalidateQueries({
      queryKey: memberRatingsKey(memberId),
    });
  }

  const saveMutation = useMutation({
    mutationFn: (body: { score: number; comment: string | null }) =>
      rating
        ? updateRating(rating.ratingId, body)
        : createRating({ movieId, ...body }),
    onSuccess: async () => {
      await refreshRatings();
      setIsEditing(false);
    },
    onError: () => {
      alert("평점을 저장하지 못했어요. 다시 시도해 주세요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: refreshRatings,
    onError: () => {
      alert("평점을 삭제하지 못했어요. 다시 시도해 주세요.");
    },
  });

  const isBusy = saveMutation.isPending || deleteMutation.isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!score || isBusy) return;

    saveMutation.mutate({
      score: Number(score),
      comment: comment.trim() || null,
    });
  }

  if (rating && !isEditing) {
    return (
      <div className="space-y-2">
        <p>{rating.score} / 5점</p>
        {rating.comment && <p>{rating.comment}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            className="text-blue-600 disabled:opacity-50"
            disabled={isBusy}
            onClick={() => {
              setScore(String(rating.score));
              setComment(rating.comment ?? "");
              setIsEditing(true);
            }}
          >
            수정
          </button>
          <button
            type="button"
            className="text-red-600 disabled:opacity-50"
            disabled={isBusy}
            onClick={() => {
              if (window.confirm("이 평점을 삭제할까요?")) {
                deleteMutation.mutate(rating.ratingId);
              }
            }}
          >
            {deleteMutation.isPending ? "삭제 중" : "삭제"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-sm space-y-3" onSubmit={handleSubmit}>
      <label className="block">
        별점
        <select
          className="mt-1 block rounded-md border border-gray-300 p-2"
          value={score}
          onChange={(event) => setScore(event.target.value)}
          disabled={isBusy}
          required
        >
          <option value="">점수를 선택해 주세요</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value}점
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        후기 (선택)
        <textarea
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={isBusy}
          maxLength={500}
          rows={3}
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={!score || isBusy}
        >
          {saveMutation.isPending ? "저장 중" : rating ? "수정 저장" : "평점 등록"}
        </button>
        {rating && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setIsEditing(false)}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}