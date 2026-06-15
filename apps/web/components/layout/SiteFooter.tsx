export function SiteFooter(): JSX.Element {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>
          © {year} Biswajit Jana · MIT License
        </span>
        <nav className="site-footer__links" aria-label="Footer">
          <a href="https://github.com/Biswajit1999/adjacent-atlas">Repository</a>
          <a href="/method">Method</a>
          <a href="/api/snapshot">Snapshot API</a>
        </nav>
      </div>
    </footer>
  );
}
