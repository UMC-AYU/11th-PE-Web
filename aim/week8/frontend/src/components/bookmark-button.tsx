import { useBookmarkStore } from '../stores/bookmark-store'
import { cn } from '../utils/cn'

type BookmarkButtonProps = {
  movieId: number
  movieTitle: string
}

export function BookmarkButton({ movieId, movieTitle }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  )
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  const bookmarkLabel = isBookmarked ? '북마크 해제' : '북마크 추가'
  const bookmarkIcon = isBookmarked
    ? '/icons/movie-icons/bookmark.svg'
    : '/icons/movie-icons/bookmark-outline.svg'

  return (
    <button
      type="button"
      className={cn(
        'absolute right-2 top-2 grid size-[30px] cursor-pointer place-items-center rounded-md',
        isBookmarked ? 'bg-blue-600' : 'bg-black/60',
      )}
      aria-label={`${movieTitle} ${bookmarkLabel}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img className="size-[18px]" src={bookmarkIcon} alt="" />
    </button>
  )
}