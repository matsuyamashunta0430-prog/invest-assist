# invest-assist

投資初心者を最もアシストする Web アプリ。新NISA積立シミュレーター、銘柄スクリーニング、ローソク足学習を統合する。

詳細仕様は [`CLAUDE.md`](./CLAUDE.md) を、実装タスクは [`TO DO.md`](./TO%20DO.md) を参照。

## クイックスタート

```bash
make init   # 依存インストール + .env 生成
make dev    # http://localhost:3000
```

## 主要コマンド

| コマンド | 用途 |
|---|---|
| `make init` | 初期セットアップ |
| `make dev` | 開発サーバー |
| `make lint` | ESLint + Prettier チェック |
| `make test` | Vitest（ユニットテスト） |
| `make test-e2e` | Playwright（E2E） |
| `make build` | プロダクションビルド |
| `make docker-build` | Docker イメージビルド |
| `make deploy` | Cloud Run デプロイ |

## 開発環境

- Node.js 20+ / pnpm 9+
- **Windows**: Git Bash + `scoop install make` を推奨（PowerShell 単体では `make` が動きません）
- Docker Desktop（コンテナビルド検証時）
- gcloud CLI（デプロイ時）

## ライセンス

UNLICENSED — 個人プロジェクト
