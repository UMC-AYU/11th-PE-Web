import { cn } from "../../utils/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 한 번에 보여줄 페이지 번호 개수 */
  visibleCount?: number;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visibleCount = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재 페이지가 속한 묶음(1~5, 6~10, ...)의 번호를 계산해요.
  const groupStart = Math.floor((currentPage - 1) / visibleCount) * visibleCount + 1;
  const groupEnd = Math.min(groupStart + visibleCount - 1, totalPages);
  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav aria-label="페이지 이동" className="mt-10 flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <img src="/icons/chevron-left.svg" alt="" aria-hidden="true" className="size-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            "size-8 rounded-md text-sm font-semibold",
            page === currentPage ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <img src="/icons/chevron-right.svg" alt="" aria-hidden="true" className="size-5" />
      </button>
    </nav>
  );
}
