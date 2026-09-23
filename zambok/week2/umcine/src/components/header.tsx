export default function Header() {
  return (
    <header className="header">
      <div className="logo">UMCine</div>

      <div className="header-actions">
        <button className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>

        <button className="icon-button" aria-label="사용자">
          <img src="/icons/person.svg" alt="" />
        </button>
      </div>
    </header>
  );
}