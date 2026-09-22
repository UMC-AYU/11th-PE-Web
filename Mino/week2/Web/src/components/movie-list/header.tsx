export function Header() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="topbar__brand" href="/" aria-label="UMCine 홈">
          <span className="topbar__brand-icon" aria-hidden="true">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </a>

        <nav className="topbar__nav" aria-label="주요 메뉴">
          <a href="/">영화</a>
          <a href="/">상영</a>
          <a href="/">내 정보</a>
        </nav>

        <div className="topbar__actions">
          <button className="topbar__icon-button" type="button" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="topbar__login" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}
