"use client";

import { useState } from "react";
import Link from "next/link";
import type { MemberRating } from "@/api/members/models";
import { useMyMemberId, useMyRatings, useRatingMutations } from "@/hooks/use-my-ratings";
import { cn } from "@/utils/cn";

const COMMENT_MAX_LENGTH = 500;

type Notice = { tone: "success" | "error"; message: string } | null;

// 영화 상세의 "내 평점" 칸: 내 평점이 없으면 등록, 있으면 수정·삭제해요.
export function MyRatingPanel({ movieId }: { movieId: number }) {
  const memberId = useMyMemberId();
  const myRatingsQuery = useMyRatings();
  const [notice, setNotice] = useState<Notice>(null);

  return (
    <aside className="border-gray-200 lg:border-l lg:pl-8">
      <h2 className="font-bold">내 평점</h2>

      {memberId === null ? (
        <div className="mt-3 rounded-md bg-gray-100 px-4 py-5 text-center text-sm text-gray-600">
          로그인하고 평점을 남겨 보세요.
          <Link href="/login" className="mt-3 block font-semibold text-blue-600 hover:underline">
            로그인하러 가기
          </Link>
        </div>
      ) : myRatingsQuery.isPending ? (
        <p className="mt-3 text-sm text-gray-400">내 평점을 불러오는 중이에요.</p>
      ) : myRatingsQuery.isError ? (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {myRatingsQuery.error.message}
        </p>
      ) : (
        <RatingForm
          // 평점을 새로 만들거나 지우면 ratingId가 바뀌어서 폼이 그 값으로 다시 채워져요.
          key={findMyRating(myRatingsQuery.data.ratings, movieId)?.ratingId ?? "new"}
          movieId={movieId}
          myRating={findMyRating(myRatingsQuery.data.ratings, movieId)}
          onNotice={setNotice}
        />
      )}

      {notice && (
        <p
          role={notice.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-3 text-sm",
            notice.tone === "error" ? "text-red-500" : "text-blue-600",
          )}
        >
          {notice.message}
        </p>
      )}
    </aside>
  );
}

function findMyRating(ratings: MemberRating[], movieId: number) {
  return ratings.find((rating) => rating.movieId === movieId);
}

function RatingForm({
  movieId,
  myRating,
  onNotice,
}: {
  movieId: number;
  myRating: MemberRating | undefined;
  onNotice: (notice: Notice) => void;
}) {
  const { create, update, remove } = useRatingMutations();
  // 내 평점이 있으면 그 값으로, 없으면 빈 값으로 시작해요.
  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");

  const isPending = create.isPending || update.isPending || remove.isPending;
  const trimmedComment = comment.trim();
  const isChanged =
    !myRating || score !== myRating.score || trimmedComment !== (myRating.comment ?? "");
  const canSave = score > 0 && isChanged && !isPending;

  const handleError = (error: Error) => onNotice({ tone: "error", message: error.message });

  const handleSave = () => {
    if (!canSave) return;
    onNotice(null);
    // 빈 한줄평은 null로 보내서 "한줄평 없음"으로 저장해요.
    const body = { score, comment: trimmedComment || null };

    if (myRating) {
      update.mutate(
        { ratingId: myRating.ratingId, ...body },
        { onSuccess: () => onNotice({ tone: "success", message: "평점을 수정했어요." }), onError: handleError },
      );
    } else {
      create.mutate(
        { movieId, ...body },
        { onSuccess: () => onNotice({ tone: "success", message: "평점을 등록했어요." }), onError: handleError },
      );
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    if (!window.confirm("이 영화에 남긴 평점을 삭제할까요?")) return;
    onNotice(null);
    remove.mutate(myRating.ratingId, {
      onSuccess: () => onNotice({ tone: "success", message: "평점을 삭제했어요." }),
      onError: handleError,
    });
  };

  return (
    <>
      <p className="mt-1 text-xs text-gray-400">
        {myRating ? "남긴 평점을 고치거나 지울 수 있어요." : "별점을 눌러 평가를 남겨보세요."}
      </p>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={score === value}
            onClick={() => setScore(value)}
          >
            <img
              src={value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"}
              alt=""
              aria-hidden="true"
              className={cn("size-6", value > score && "opacity-40")}
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
        maxLength={COMMENT_MAX_LENGTH}
        placeholder="영화에 대한 느낌을 남겨주세요."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-4 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none focus:border-gray-400"
      />
      <p className="text-right text-xs text-gray-400">
        {comment.length} / {COMMENT_MAX_LENGTH}
      </p>

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className="mt-3 w-full rounded-md bg-gray-900 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {create.isPending || update.isPending
          ? "저장하는 중..."
          : myRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {myRating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-2 w-full rounded-md border border-gray-200 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          {remove.isPending ? "삭제하는 중..." : "평점 삭제"}
        </button>
      )}
    </>
  );
}
