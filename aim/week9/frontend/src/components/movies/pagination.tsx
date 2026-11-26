interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) {
    return null;
  }

  const startPage = Math.floor((page - 1) / 5) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <nav
      className="mt-10 flex justify-center"
      aria-label="페이지네이션"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="grid size-9 place-items-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img
            src="/icons/movie-icons/chevron-left.svg"
            alt=""
            className="size-4"
          />
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`${pageNumber}페이지`}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={
              pageNumber === page
                ? "grid size-9 place-items-center rounded-md bg-blue-600 text-sm font-semibold text-white"
                : "grid size-9 place-items-center rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100"
            }
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
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
  );
}