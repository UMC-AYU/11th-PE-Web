"use client";

import Link from "next/link";
import { useFavoriteStatus, useToggleFavorite } from "@/hooks/use-favorites";
import { useMyMemberId } from "@/hooks/use-my-ratings";
import { cn } from "@/utils/cn";

const buttonClass =
  "mt-5 flex w-fit items-center gap-1 rounded-md px-4 py-2 text-xs font-semibold disabled:opacity-60";

// 영화 상세의 찜하기 버튼: 찜 여부를 조회해서 찜하기 / 찜 해제를 바꿔 보여줘요.
export function FavoriteButton({ movieId }: { movieId: number }) {
  const memberId = useMyMemberId();
  const statusQuery = useFavoriteStatus(movieId);
  const toggleMutation = useToggleFavorite(movieId);

  // 로그인하지 않았으면 로그인 페이지로 안내해요.
  if (memberId === null) {
    return (
      <Link href="/login" className={cn(buttonClass, "bg-blue-600 text-white")}>
        <img src="/icons/bookmark-outline.svg" alt="" aria-hidden="true" className="size-4 invert" />
        로그인하고 찜하기
      </Link>
    );
  }

  const favorited = statusQuery.data?.isFavorite ?? false;
  const isBusy = statusQuery.isPending || toggleMutation.isPending;

  return (
    <div>
      <button
        type="button"
        onClick={() => toggleMutation.mutate(favorited)}
        disabled={isBusy}
        aria-pressed={favorited}
        className={cn(
          buttonClass,
          favorited
            ? "border border-blue-600 bg-white text-blue-600"
            : "bg-blue-600 text-white",
        )}
      >
        <img
          src={favorited ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
          aria-hidden="true"
          className={cn("size-4", !favorited && "invert")}
        />
        {toggleMutation.isPending ? "처리하는 중..." : favorited ? "찜 해제" : "찜하기"}
      </button>
      {toggleMutation.isError && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {toggleMutation.error.message}
        </p>
      )}
    </div>
  );
}
