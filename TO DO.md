# TO DO — invest-assist 実装タスク

> `CLAUDE.md` に基づく実行計画。チェックボックスで進捗管理する。
> フェーズ1（MVP: NISA積立シミュレーター）完了 = 公開可能な状態。

---

## フェーズ 0: プロジェクト初期化

### 0.1 リポジトリ・基本構成

- [x] `git init` & 初期コミット
- [x] `.gitignore` 作成（Node.js / Next.js / .env / .vscode / .husky/\_）
- [x] `README.md` 作成（プロジェクト概要のみ、詳細は CLAUDE.md にリンク）
- [ ] `LICENSE` ファイル（プライベートのため UNLICENSED 表記でも可）
- [ ] GitHub リポジトリ作成（プライベート） → `gh repo create`
- [ ] main ブランチ保護ルール設定（PR必須・レビュー1）

### 0.2 Next.js プロジェクト雛形

- [x] Next.js 15 + TypeScript + Tailwind v4 + App Router の雛形を手動配置（`create-next-app` の代わりに設定ファイル群を直接生成）
- [x] Node.js バージョン固定（`.nvmrc` に `20`）
- [x] pnpm バージョン固定（`packageManager` フィールドを `package.json` に設定）
- [x] `tsconfig.json` に厳格設定（`strict: true`、`noUncheckedIndexedAccess: true`、`types: ["vitest/globals"]`）
- [x] セキュリティヘッダ設定（`next.config.ts` headers: X-Frame-Options, Referrer-Policy 等）

### 0.3 開発ツール整備

- [x] ESLint 9 flat config（`eslint.config.mjs`、`@eslint/eslintrc` の FlatCompat 経由）
- [x] Prettier 3 導入（`.prettierrc`、`.prettierignore`、`prettier-plugin-tailwindcss`）
- [x] Vitest 導入（`vitest.config.ts`、`tests/setup.ts`）
- [x] Playwright 導入（`playwright.config.ts`、`tests/e2e/smoke.spec.ts`）
- [x] Husky + lint-staged 設定（`.husky/pre-commit`、`prepare: husky || true`）
- [x] commitlint 設定（`commitlint.config.mjs`、`.husky/commit-msg`）
- [x] `Makefile` 作成（`init / dev / lint / format / test / test-e2e / tsc / build / docker-build / deploy / clean`）
- [x] `pnpm install` 実行＆ lockfile コミット（1m7s、Done）
- [x] `pnpm lint` `pnpm tsc` `pnpm test` がローカルで通ることを確認（37/37 テスト通過）
- [x] `pnpm build` がローカルで通ることを確認（全6ルート静的生成、トップ 9.26kB / 109kB FLJS）

### 0.4 UI ライブラリ初期化

- [ ] shadcn/ui 初期化（`pnpm install` 後に `pnpm dlx shadcn@latest init`）
- [ ] 主要コンポーネント追加（`button`, `card`, `input`, `label`, `slider`, `tabs`, `tooltip`）
- [x] Tailwind v4 安定版指定（`^4.1.0`、ベータ→安定へ修正済み）
- [x] Noto Sans JP + Inter フォント設定（`next/font/google`、weight 指定、preload: false）

### 0.5 環境変数・シークレット

- [x] `.env.example` 作成（変数名のみ）
- [ ] `.env.local` 作成（`make init` 実行時に自動コピー）
- [x] Zod による env バリデーション（`src/env.ts`）

### 0.6 インフラ初期ファイル（前倒し）

- [x] `Dockerfile`（マルチステージビルド、Next standalone、non-root user）
- [x] `.dockerignore`
- [x] プレースホルダーページ（`/simulator`, `/learn/videos`）配置 → page.tsx の Link 切れ防止

---

## フェーズ 1: MVP — NISA積立シミュレーター

### 1.1 ドメインロジック（テスト駆動で）

- [x] `src/lib/simulator/calculate.ts` 作成（simulate / summarize / findProfitMilestones / validateInput）
- [x] 月次複利計算ユニットテスト（calculate.test.ts: 18 件、境界値含む）
- [x] フォーマッタ単体テスト（utils.test.ts: 8 件、toFixed の浮動小数点バグも修正）
- [x] URL クエリ ↔ 入力値の双方向シリアライズ（`src/lib/simulator/schema.ts` + ラウンドトリップテスト 9 件）

### 1.2 画面実装

- [x] レイアウト共通化（`SiteHeader` sticky + `SiteFooter` 免責、`layout.tsx` 統合）
- [x] S0: トップページ（ヒーロー＋3機能カード＋CTA）
- [x] S1: 積立シミュレーター画面 `/simulator`
  - [x] 入力フォーム（月額・年利・期間・初期投資）— 軽量自前実装（useState、Zod 防御）
  - [x] スライダーと数値入力の連動（draft 文字列 state でフリッカ回避、blur/Enter で確定）
  - [x] グラフ表示（Recharts: 元本・評価額・利益の3系列折れ線、年次間引き）
  - [x] サマリーカード（最終評価額・総積立額・利益額・利益率）
  - [x] マイルストーン表示（+100万/500万/1000万/5000万）
  - [x] URL シェアボタン（クエリパラメータ生成 → `history.replaceState` + クリップボード）
  - [x] 入力デフォルト値: 月3万円／年利5%／20年
- [x] S2: 学べる動画ページ `/learn/videos`（動画10本カード、`src/data/videos.ts` 分離）
- [x] S3: 学べるブログページ `/learn/blogs`（ブログ10本カード、`src/data/blogs.ts` 分離）
- [x] S4: よくある失敗ページ `/learn/mistakes`（5件）
- [x] S5: About / 免責事項 `/about`
- [ ] 404 / error ページのカスタム化
- [ ] OG画像・Twitter カードのメタデータ追加（Codex指摘 M5）

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

| フェーズ          | タスク総数 | 完了 | 状態                         |
| ----------------- | ---------- | ---- | ---------------------------- |
| 0. 初期化         | 29         | 23   | 進行中（79%）                |
| 1. MVP            | 37         | 19   | 進行中（51%、1.1+1.2 完了）  |
| 2. スクリーニング | 9          | 0    | 未着手                       |
| 3. 認証・クイズ   | 7          | 0    | 未着手                       |
| 4. 拡張           | 4          | 0    | 未着手                       |
| インフラ          | 14         | 2    | 進行中（Docker関連を前倒し） |
| ドキュメント      | 4          | 0    | 未着手                       |
| ガードレール      | 5          | 0    | 未着手                       |

**次にやること**: フェーズ1.5（テスト追加）／インフラ（GitHub Actions CI）／GitHub リポジトリ作成。手順⑥⑦㉑（CI/CD・Issue 化）へ進む準備が整っています。

## レビュー履歴

| 日付       | レビュアー          | 対象               | 主な指摘                                                                                                                                                                                                                                                                                    | 対応                                                               |
| ---------- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 2026-05-14 | Codex役エージェント | 初期スキャフォルド | C1-C3, H1-H6, M4-M8, L5 など計15件（lint script / husky / Tailwind beta / Noto Sans JP subsets / Dockerfile 不在 / typedRoutes / フォント変数不整合 / vitest types）                                                                                                                        | 全て修正済み                                                       |
| 2026-05-14 | Codex役エージェント | ドメインロジック   | C1: annuity-due/ordinary の解釈ズレ（業界標準と50万円差） / H3: 負利率の仕様ブレ / H4: `z.coerce.number` の空文字silent 0 / H5: `fromSearchParams` が ZodError throw → 500 リスク / M5: テスト境界がガバくC1を検知できない / H1: readonly 不足 / H2: O(n×m) / L2: フィールド名 / N1-N5 など | C1/H3/H4/H5/M5/H1/L2/N1/N5 を修正、H2/M1-M4 などは次フェーズで対応 |

---

**最終更新**: 2026-05-14
