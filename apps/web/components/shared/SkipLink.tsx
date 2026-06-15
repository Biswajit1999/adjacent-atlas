/**
 * A keyboard-first "skip to content" link. Hidden until focused, it lets
 * keyboard and screen-reader users bypass the header navigation.
 */
export function SkipLink(): JSX.Element {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
