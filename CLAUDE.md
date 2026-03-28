# Zai

個人の投資・資産管理モノリポ。

## Tech Stack

- pnpm workspaces (monorepo)
- React 19+ / Vite 6+ / TailwindCSS 4+ / TypeScript 6+
- Vitest 4+ / Testing Library
- GitHub Pages (`/zai/`) でホスト
- ESLint 9 (flat config, strict) + Prettier (printWidth: 150)

## Commands

```bash
pnpm dev          # Portal dev server
pnpm build        # Production build
pnpm test         # Run tests
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
pnpm format       # Prettier format
pnpm format:check # Prettier check
pnpm lint:md      # Markdownlint
```

## Structure

- `apps/portal/` — ポートフォリオ可視化 SPA (@zai/portal)

## Coding Conventions

- Feature-based directory structure (`features/<name>/{components,hooks,lib,types.ts}`)
- `@/` path alias for `src/`
- Strict TypeScript (`exactOptionalPropertyTypes`, `isolatedDeclarations`, `noUncheckedIndexedAccess`)
- Immutable state (`readonly` properties)
- localStorage for data persistence (prefix: `zai:`)
