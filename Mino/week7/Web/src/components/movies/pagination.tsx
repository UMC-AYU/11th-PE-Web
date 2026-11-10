import { cn } from "../../utils/cn";

interface PaginationProps { currentPage: number; totalPages: number; onPageChange: (page: number) => void }

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from(
    new Set([
      1,
      totalPages,
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ]),
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const buttonClass = "grid h-[34px] min-w-[34px] cursor-pointer place-items-center rounded-[5px] bg-white shadow-[inset_0_0_0_1px_#dbe1ea] disabled:cursor-default disabled:opacity-40";
  return (
    <nav className="mt-9 flex justify-center gap-2" aria-label="영화 목록 페이지">
      <button className={buttonClass} type="button" aria-label="이전 페이지" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><img className="size-4" src="/icons/chevron-left.svg" alt="" /></button>
      {pages.map((page, index) => (
        <span className="contents" key={page}>
          {index > 0 && page - pages[index - 1] > 1 ? (
            <span className="grid h-[34px] min-w-5 place-items-center text-slate-400" aria-hidden="true">…</span>
          ) : null}
          <button className={cn(buttonClass, "text-sm text-slate-600", currentPage === page && "bg-[#1e88ff] font-bold text-white shadow-none")} type="button" aria-label={`${page}페이지`} aria-current={currentPage === page ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</button>
        </span>
      ))}
      <button className={buttonClass} type="button" aria-label="다음 페이지" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><img className="size-4" src="/icons/chevron-right.svg" alt="" /></button>
    </nav>
  );
}
