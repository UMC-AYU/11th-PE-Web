import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-9 flex items-center justify-center gap-1.5"
      aria-label="영화 목록 페이지"
    >
      {pages.map((page) => (
        <button
          key={page}
          className={cn(
            "h-9 min-w-9 cursor-pointer rounded-[7px] border border-[#dde2e9] bg-white px-2.5 text-[#596170] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[rgba(47,108,229,0.35)]",
            page === currentPage &&
              "border-[#2f6ce5] bg-[#2f6ce5] text-white",
          )}
          type="button"
          aria-label={`${page}페이지로 이동`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
