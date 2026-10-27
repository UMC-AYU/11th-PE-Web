import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({
  movieId,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleBookmark(movieId);
      }}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition",
        isBookmarked
          ? "bg-blue-600 shadow-lg shadow-blue-600/30"
          : "bg-black/60 hover:bg-black/80",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        className="h-5 w-5"
      />
    </button>
  );
}