import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieTitle: string;
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
  unbookmarkedIconLight?: boolean;
}

export function BookmarkButton({ movieTitle, isBookmarked, onToggle, className, unbookmarkedIconLight = false }: BookmarkButtonProps) {
  return (
    <button
      className={cn(
        "grid cursor-pointer place-items-center border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        className,
        isBookmarked ? "border-[#1e88ff] bg-[#1e88ff]" : "",
      )}
      type="button"
      aria-label={isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크 추가`}
      aria-pressed={isBookmarked}
      onClick={onToggle}
    >
      <img className={cn("size-[18px]", (isBookmarked || unbookmarkedIconLight) && "invert")} src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
    </button>
  );
}
