# Zai

個人の投資・資産管理モノリポ（pnpm workspaces）。

## Apps

- **portal** (`@zai/portal`) — ポートフォリオ可視化 SPA

## Prerequisites

- Node.js >= 24.13.0
- pnpm >= 10.0.0

## Development

```bash
pnpm install
pnpm dev          # Portal dev server
pnpm build        # Production build
pnpm test         # Run tests
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
pnpm format       # Prettier format
pnpm format:check # Prettier check
pnpm lint:md      # Markdownlint
```

## Data Architecture

- 金融データは `zai-datastore` (private GitHub repo) に GitHub Issues として保存
- 認証は [gh-auth-bridge](https://github.com/koumatsumoto/gh-auth-bridge) を共有
- このリポジトリに個人情報・資産データは含めない

## Deployment

GitHub Pages (`https://koumatsumoto.github.io/zai/`) に自動デプロイ。
