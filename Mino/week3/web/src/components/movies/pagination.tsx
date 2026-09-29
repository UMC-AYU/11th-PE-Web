import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-9 flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button
        className="grid h-[34px] min-w-[34px] cursor-pointer place-items-center rounded-[5px] bg-white shadow-[inset_0_0_0_1px_#dbe1ea] disabled:cursor-default disabled:opacity-40"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-4" src="/icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={cn(
            "grid h-[34px] min-w-[34px] cursor-pointer place-items-center rounded-[5px] bg-white text-sm text-slate-600 shadow-[inset_0_0_0_1px_#dbe1ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            currentPage === page && "bg-[#1e88ff] font-bold text-white shadow-none",
          )}
          type="button"
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="grid h-[34px] min-w-[34px] cursor-pointer place-items-center rounded-[5px] bg-white shadow-[inset_0_0_0_1px_#dbe1ea] disabled:cursor-default disabled:opacity-40"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-4" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  )
}
