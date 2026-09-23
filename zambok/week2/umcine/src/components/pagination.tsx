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
    <nav className="pagination" aria-label="페이지 이동">
      <button
        className="page-arrow"
        aria-label="이전 페이지"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`page-button ${
            currentPage === page ? "active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-arrow"
        aria-label="다음 페이지"
        onClick={() => onPageChange(Math.min(5, currentPage + 1))}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}