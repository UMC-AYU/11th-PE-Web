export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button type="button" aria-label="이전 페이지">
        ‹
      </button>
      <button type="button" className="active" aria-current="page">
        1
      </button>
      <button type="button" aria-label="다음 페이지">
        ›
      </button>
    </nav>
  )
}