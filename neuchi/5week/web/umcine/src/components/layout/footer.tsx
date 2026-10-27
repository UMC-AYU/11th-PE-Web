export function Footer() {
  return (
    <footer
      style={{
        padding: "20px",
        marginTop: "40px",
        borderTop: "1px solid var(--border)",
        fontSize: "14px",
        color: "var(--text)",
      }}
    >
      <p style={{ margin: 0 }}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
