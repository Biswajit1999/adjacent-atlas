# Demo screenshot — composition brief

Screenshots are captured from the running app, never mocked. This brief is about
*composition* — how to frame a real capture so it represents the tool well.

## The hero shot (atlas)

- Route: `/atlas`. Let the layout settle, then drag to a three-quarter angle so
  the depth of the point field reads.
- Click a high-adjacency node so the **inspector** is open (selection halo
  visible, score components shown).
- Make sure the side panels are visible: filters, graph statistics, and the
  opportunity radar. The timeline band should show under the scene.
- Capture at ~1440×900, dark OS theme, device pixel ratio 2.

## Secondary shots

- `/` — hero copy beside the live 3D preview.
- `/briefs/<id>` — a brief detail page with its field note, to show the authored
  side of the project.
- `/method` — the scoring equation, to show the transparency.

## Don'ts

- No invented data, no staged "results", no UI that differs from the app.
- Don't crop out the honesty cues (the seed/snapshot id, the labelled tags).

Save captures under `apps/web/public/social/` or `docs/images/` and reference
them from the README with relative paths.
