# TO DO — invest-assist 実装タスク

> `CLAUDE.md` に基づく実行計画。チェックボックスで進捗管理する。
> フェーズ1（MVP: NISA積立シミュレーター）完了 = 公開可能な状態。

---

## フェーズ 0: プロジェクト初期化

### 0.1 リポジトリ・基本構成

- [ ] `git init` & 初期コミット
- [ ] `.gitignore` 作成（Node.js / Next.js / .env / .vscode）
- [ ] `README.md` 作成（プロジェクト概要のみ、詳細は CLAUDE.md にリンク）
- [ ] `LICENSE` ファイル（プライベートのため UNLICENSED 表記でも可）
- [ ] GitHub リポジトリ作成（プライベート） → `gh repo create`
- [ ] main ブランチ保護ルール設定（PR必須・レビュー1）

### 0.2 Next.js プロジェクト雛形

- [ ] `pnpm create next-app@latest .` で雛形生成（TypeScript / App Router / Tailwind / ESLint / src/ ディレクトリ / @ alias 全て Yes）
- [ ] Node.js バージョン固定（`.nvmrc` に `20`）
- [ ] pnpm バージョン固定（`packageManager` フィールドを `package.json` に設定）
- [ ] `tsconfig.json` に厳格設定（`strict: true`、`noUncheckedIndexedAccess: true`）

### 0.3 開発ツール整備

- [ ] ESLint 9 flat config に移行（`eslint.config.mjs`）
- [ ] Prettier 3 導入（`.prettierrc`、`.prettierignore`）
- [ ] Vitest 導入（`vitest.config.ts`、サンプルテスト）
- [ ] Playwright 導入（`playwright.config.ts`、サンプル E2E）
- [ ] Husky + lint-staged 設定（pre-commit で lint/format/type-check/test）
- [ ] commitlint 設定（Conventional Commits を強制）
- [ ] `Makefile` 作成（`make init / dev / lint / test / build / docker-build / deploy`）

### 0.4 UI ライブラリ初期化

- [ ] shadcn/ui 初期化（`npx shadcn@latest init`）
- [ ] 主要コンポーネント追加（`button`, `card`, `input`, `label`, `slider`, `tabs`, `tooltip`）
- [ ] Tailwind v4 設定確認（カラートークン、フォント、breakpoints）
- [ ] Noto Sans JP + Inter フォント設定（`next/font`）

### 0.5 環境変数・シークレット

- [ ] `.env.example` 作成（変数名のみ）
- [ ] `.env.local` 作成（ローカル開発用、gitignore）
- [ ] Zod による env バリデーション（`src/env.ts`）

---

## フェーズ 1: MVP — NISA積立シミュレーター

### 1.1 ドメインロジック（テスト駆動で）

- [ ] `src/lib/simulator/calculate.ts` 作成
  - 入力: 月額、年利、期間（月）、初期投資額
  - 出力: 月次の元本／評価額／利益の配列
- [ ] 月次複利計算ユーティリティのユニットテスト（境界値: 0年、超長期、年利0%、年利マイナス）
- [ ] フォーマッタ（`formatJPY`、`formatPercent`）と単体テスト
- [ ] URL クエリ ↔ 入力値の双方向シリアライズ（Zod スキーマで）

### 1.2 画面実装

- [ ] レイアウト共通化（`src/app/layout.tsx`、`Header`、`Footer`、`Container`）
- [ ] S0: トップページ（ヒーロー＋3機能カード＋CTA）
- [ ] S1: 積立シミュレーター画面 `/simulator`
  - [ ] 入力フォーム（月額・年利・期間・初期投資）— React Hook Form + Zod
  - [ ] スライダーと数値入力の連動
  - [ ] グラフ表示（Recharts: 元本・評価額・利益の3系列折れ線）
  - [ ] サマリーカード（最終評価額・総積立額・利益額・利益率）
  - [ ] マイルストーン表示（「+100万になる月」「+1000万になる月」等）
  - [ ] URL シェアボタン（クエリパラメータ生成 → クリップボードコピー）
  - [ ] 入力デフォルト値: 月3万円／年利5%／20年
- [ ] S2: 学べる動画ページ `/learn/videos`（動画10本カード）
- [ ] S3: 学べるブログページ `/learn/blogs`（ブログ10本カード）
- [ ] S4: よくある失敗ページ `/learn/mistakes`
- [ ] S5: About / 免責事項 `/about`
- [ ] 404 / error ページ

### 1.3 レスポンシブ・アクセシビリティ

- [ ] モバイル幅（375px）で全画面確認
- [ ] タブレット幅（768px）／PC（1280px）で確認
- [ ] キーボード操作で全機能利用可能
- [ ] aria 属性適切に設定（フォーム・グラフ）
- [ ] Lighthouse スコア: Performance / Accessibility / Best Practices / SEO すべて 90+

### 1.4 SEO・メタ

- [ ] `metadata` 各ページ設定（title / description / OG画像）
- [ ] `sitemap.xml` 自動生成（`next-sitemap` または `app/sitemap.ts`）
- [ ] `robots.txt`
- [ ] OG 画像（1200x630）デザイン1種類作成

### 1.5 テスト

- [ ] ユニットテスト: ドメインロジック網羅
- [ ] コンポーネントテスト: フォーム入力 → 計算結果反映
- [ ] E2E（Playwright）: トップ → シミュレーター → URL シェア → リロード復元
- [ ] CI でテスト自動実行

---

## フェーズ 2: 銘柄スクリーニング（拡張、MVP公開後）

### 2.1 DB・データ取得

- [ ] Prisma 導入、`prisma/schema.prisma` 作成
- [ ] `Stock` モデル定義（コード・社名・市場・時価総額・PER・PBR・ROE・自己資本比率・配当性向・連続増配年数）
- [ ] PostgreSQL ローカル起動（Docker Compose）
- [ ] 初期マイグレーション
- [ ] J-Quants API クライアント実装
- [ ] 日次バッチ（Cloud Scheduler → Cloud Run Job）で銘柄データ更新

### 2.2 スクリーニング UI

- [ ] 条件フォーム（時価総額・PER・PBR・自己資本比率・配当性向・連続増配）
- [ ] 結果一覧テーブル（ソート・ページネーション）
- [ ] 銘柄詳細ページ（指標・指標の意味解説）
- [ ] お気に入り（ローカルストレージ）

---

## フェーズ 3: 認証＋クイズ（拡張）

- [ ] NextAuth.js (Auth.js v5) + Google OAuth
- [ ] `User` モデル、セッション管理
- [ ] クイズ問題データ（ローソク足／チャートパターン）
- [ ] クイズ画面（4択、解説表示）
- [ ] 進捗保存・正答率表示
- [ ] お気に入り銘柄を DB に保存

---

## フェーズ 4: マルチモーダル・拡張

- [ ] チャート画像アップロード → Claude API でパターン判定
- [ ] LINE Bot 連携
- [ ] iDeCo シミュレーター
- [ ] ダークモード

---

## インフラ・デプロイ（フェーズ1と並行）

### I.1 コンテナ化

- [ ] `Dockerfile`（Next.js standalone 出力でマルチステージビルド）
- [ ] `.dockerignore`
- [ ] ローカルでイメージビルド検証（`make docker-build`）

### I.2 GCP セットアップ

- [ ] GCP プロジェクト準備（Project ID は後で確定）
- [ ] Artifact Registry リポジトリ作成
- [ ] Cloud Run サービス初回デプロイ（手動: `make deploy`）
- [ ] Cloud SQL インスタンス作成（フェーズ2着手時）
- [ ] Secret Manager にシークレット登録
- [ ] カスタムドメイン設定（任意）

### I.3 GitHub Actions

- [ ] `.github/workflows/ci.yml` — PR 時に Lint / Type-check / Test
- [ ] `.github/workflows/deploy.yml` — main push で Cloud Run へデプロイ
- [ ] GCP サービスアカウント鍵 → GitHub Secrets 登録（Workload Identity 推奨）
- [ ] デプロイ後の URL を PR コメントに自動投稿

### I.4 監視

- [ ] Cloud Logging で標準出力確認
- [ ] Cloud Error Reporting 有効化
- [ ] アラート: エラー率 > 5%、レイテンシ p95 > 2s
- [ ] uptime チェック（無料枠で）

---

## ドキュメント

- [ ] 画面定義書 `docs/screen-spec.md`（手順⑩）
- [ ] API 仕様書 `docs/api-spec.md`（手順⑪）
- [ ] テスト仕様書 `docs/test-spec.md`（手順⑫）
- [ ] Prisma スキーマ定義書 `docs/db-schema.md`（手順⑮、フェーズ2前）

---

## ガードレール（手順⑬〜⑳と整合）

- [ ] ESLint 9 + @typescript-eslint 設定（手順⑬⑰）
- [ ] CI で `npm run lint` 必須化（手順⑭）
- [ ] Husky で pre-commit に lint / tsc / test を仕込む（手順⑯⑲）
- [ ] CI/CD（GitHub Actions → Cloud Run）（手順⑳）
- [ ] Makefile に `make init / dev / lint / test / build / deploy` を集約

---

## 進捗ダッシュボード

| フェーズ | タスク総数 | 完了 | 状態 |
|---|---|---|---|
| 0. 初期化 | 24 | 0 | 未着手 |
| 1. MVP | 35 | 0 | 未着手 |
| 2. スクリーニング | 9 | 0 | 未着手 |
| 3. 認証・クイズ | 7 | 0 | 未着手 |
| 4. 拡張 | 4 | 0 | 未着手 |
| インフラ | 14 | 0 | 未着手 |
| ドキュメント | 4 | 0 | 未着手 |
| ガードレール | 5 | 0 | 未着手 |

**次にやること**: フェーズ0「リポジトリ・基本構成」から順に実装。1タスク完了ごとにチェックボックスを更新する。

---

**最終更新**: 2026-05-14
