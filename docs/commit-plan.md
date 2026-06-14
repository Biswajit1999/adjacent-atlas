# Commit plan

A suggested sequence of conventional commits that mirrors how the project was
assembled. Each is independently buildable.

1. `chore: scaffold pnpm + turborepo workspace and shared tsconfig`
2. `chore: add governance (license, contributing, security, citation, CI)`
3. `feat(engine): core types, math utilities, and scoring model`
4. `feat(engine): graph, synthesis, and snapshot export`
5. `test(engine): scoring, metrics, graph, and layout suites`
6. `feat(data): JSON Schemas and EPRV seed graph`
7. `feat(scripts): build-snapshot and validate-snapshot`
8. `feat(ui): tokens and primitives (Panel, Tag, ScoreBar, Button, Badge)`
9. `feat(web): app shell, layout, and server pages`
10. `feat(web): JSON API routes for snapshot and briefs`
11. `feat(engine): deterministic force-directed layout`
12. `feat(web): 3D atlas scene, worker layout, and shell`
13. `feat(web): filters, inspector, briefs, and method visualisations`
14. `feat(embed): standalone ranked view and React component`
15. `docs: architecture, methodology, scoring, and visual language`
16. `chore: social-card generator and launch pack`

Keep each commit green: `pnpm typecheck && pnpm build && pnpm test`.
