export default function Pagination() {
  return (
    <nav
      className="mt-10 flex justify-center"
      aria-label="페이지네이션"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled
          className="grid size-9 place-items-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src="/icons/movie-icons/chevron-left.svg"
            alt=""
            className="size-4"
          />
        </button>

        <span
          aria-current="page"
          className="grid size-9 place-items-center rounded-md bg-blue-600 text-sm font-semibold text-white"
        >
          1
        </span>

        <button
          type="button"
          aria-label="다음 페이지"
          disabled
          className="grid size-9 place-items-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src="/icons/movie-icons/chevron-right.svg"
            alt=""
            className="size-4"
          />
        </button>
      </div>
    </nav>
  )
}