# Zai

個人の投資・資産管理モノリポ。

## Tech Stack

- pnpm workspaces (monorepo)
- React 19+ / Vite 6+ / TailwindCSS 4+ / TypeScript 6+
- TanStack Query 5+ (server state management)
- Vitest 4+ / Testing Library
- GitHub Pages (`/zai/`) でホスト
- ESLint 9 (flat config, strict) + Prettier (printWidth: 150)

## Data Architecture

- **Backend**: `zai-datastore` (private GitHub repo) — GitHub Issues をデータストアとして使用
- **認証**: `gh-auth-bridge` を共有（`gh-auth-bridge:token` を読み取り）
- **キャッシュ**: localStorage (`zai:` prefix) は GitHub Issues のキャッシュとユーザ設定のみ
- **1 Issue = 全資産**: `portal` + `asset` ラベルの単一 Issue に全 Holding を JSON で格納

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
  - `features/auth/` — 認証（gh-auth-bridge 共有、token-store, auth-client, AuthGuard）
  - `features/holdings/` — 資産管理（github-api, body-codec, repo-init, aggregation）
  - `shared/lib/` — github-client, errors, rate-limit, storage-keys, forex-store

## Coding Conventions

- Feature-based directory structure (`features/<name>/{components,hooks,lib,types.ts}`)
- `@/` path alias for `src/`
- Strict TypeScript (`exactOptionalPropertyTypes`, `isolatedDeclarations`, `noUncheckedIndexedAccess`)
- Immutable state (`readonly` properties)
- localStorage for caching and user preferences (`zai:` prefix for app data, `gh-auth-bridge:` prefix for shared auth tokens)
- **個人情報・資産データ・API トークンをリポジトリにコミットしてはならない**
- `zai-datastore` (private repo) が全金融データの永続化先。ソースコードに資産額・口座情報等を含めない
