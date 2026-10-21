import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav
      className="mt-16 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition hover:bg-white/10"
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전"
          className="h-4 w-4"
        />
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "h-10 w-10 rounded-lg text-sm font-semibold transition",
            currentPage === page
              ? "bg-white text-black"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(5, currentPage + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition hover:bg-white/10"
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음"
          className="h-4 w-4"
        />
      </button>
    </nav>
  );
}