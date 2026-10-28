import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
    movieId: number;
    movieTitle: string;
    variant?: "card" | "detail" | "search";
}

export function BookmarkButton({
    movieId,
    movieTitle,
    variant = "card",
}: BookmarkButtonProps) {
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(movieId),
    );
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

    return (
        <button
            className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 font-bold transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35",
                variant === "card" &&
                    "absolute top-2 right-2 size-8 rounded-lg border border-white/90 bg-[rgba(19,23,31,0.88)] p-0 sm:top-[11px] sm:right-[11px] sm:size-9",
                variant === "card" && isBookmarked &&
                    "border-[#2f6ce5] bg-[#2f6ce5]",
                variant === "detail" &&
                    "h-10 rounded-lg bg-[#2f6ce5] px-4 text-sm text-white hover:bg-[#245fd4]",
                variant === "search" &&
                    "mt-2 self-start rounded-md border border-[#dce1e8] bg-white px-2.5 py-1.5 text-xs text-[#596170] hover:border-[#2f6ce5]",
                variant === "search" && isBookmarked &&
                    "border-[#2f6ce5] text-[#2f6ce5]",
            )}
            type="button"
            aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movieId)}
        >
            <img
                className={cn(
                    "size-5",
                    variant === "card" && "invert sm:size-6",
                    variant === "detail" && "brightness-0 invert",
                    variant === "search" && "size-4",
                )}
                src={
                    isBookmarked
                        ? "/icons/bookmark.svg"
                        : "/icons/bookmark-outline.svg"
                }
                alt=""
            />
            {variant !== "card" && (
                <span>{isBookmarked ? "북마크 해제" : "북마크 추가"}</span>
            )}
        </button>
    );
}
