# Accessibility

What is in place, and what is honestly still open. The aim is that everything
except the 3D scene itself is fully usable by keyboard and screen reader, and
that the scene always has a textual equivalent.

## In place

- **Skip link.** The first focusable element jumps to `#main-content`
  (`components/shared/SkipLink.tsx`), which is a focusable `<main>` landmark.
- **Visible focus.** A consistent focus ring is applied to links, buttons,
  inputs, the search field, and `[tabindex]` elements via `:focus-visible`.
- **Keyboard operation.** Filters are native buttons, checkboxes-as-chips, a
  range input, and a select; the ranked list rows and opportunity-radar rows are
  real `<button>`/`role="button"` elements with Enter/Space handlers.
- **Reduced motion.** `prefers-reduced-motion: reduce` disables the atlas idle
  rotation and selection pulse (handled in `AtlasScene.tsx`) and near-eliminates
  CSS animations/transitions (handled in `globals.css`).
- **Textual equivalent for the scene.** Without WebGL or JavaScript, `/atlas`
  shows the full ranked list (a `<noscript>` fallback plus a graceful
  WebGL-unavailable message). The same scores appear in the list and inspector.
- **Semantics.** Landmarks (`header`/`main`/`footer`/`nav`), `aria-label`s on
  navigation and controls, `aria-current` on the active nav link, `aria-pressed`
  on toggles, and `VisuallyHidden` labels where a control is icon- or
  placeholder-only.

## Known gaps

- The 3D scene is inherently visual; selection is mirrored in the keyboard-
  operable ranked list, but there is no keyboard traversal of nodes *inside* the
  canvas yet.
- Colour is a primary encoding for node kind. Labels accompany colour in the
  legend, inspector, and lists, but a fully colour-blind-safe palette has not
  been formally verified.
- No automated accessibility test (axe) is wired into CI yet.

These are tracked as future work rather than papered over.
