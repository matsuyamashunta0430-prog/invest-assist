# TO DO — invest-assist 実装タスク

> `CLAUDE.md` に基づく実行計画。チェックボックスで進捗管理する。
> フェーズ1（MVP: NISA積立シミュレーター）完了 = 公開可能な状態。

---

## フェーズ 0: プロジェクト初期化

### 0.1 リポジトリ・基本構成

- [x] `git init` & 初期コミット
- [x] `.gitignore` 作成（Node.js / Next.js / .env / .vscode / .husky/\_）
- [x] `README.md` 作成（プロジェクト概要のみ、詳細は CLAUDE.md にリンク）
- [ ] `LICENSE` ファイル（プライベートのため UNLICENSED 表記でも可） → #15
- [x] GitHub リポジトリ作成（プライベート） → matsuyamashunta0430-prog/invest-assist
- [x] main ブランチ保護ルール設定（Ruleset で適用、Public 化済） → #11 クローズ

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

- [ ] shadcn/ui 初期化（必要になったら）— 現状は自前最小実装で代替済み
- [ ] 主要コンポーネント追加（必要になったら）— Phase 2 以降の複雑 UI が出てきた時点で検討
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
- [ ] 404 / error ページのカスタム化 → #5
- [ ] OG画像・Twitter カードのメタデータ追加（Codex指摘 M5）→ #4

### 1.3 レスポンシブ・アクセシビリティ → #7（全項目を統合）

- [ ] モバイル幅（375px）で全画面確認 → #7
- [ ] タブレット幅（768px）／PC（1280px）で確認 → #7
- [ ] キーボード操作で全機能利用可能 → #7
- [ ] aria 属性適切に設定（フォーム・グラフ）→ #7
- [ ] Lighthouse スコア: Performance / Accessibility / Best Practices / SEO すべて 90+ → #8

### 1.4 SEO・メタ

- [ ] `metadata` 各ページ設定（title / description / OG画像）→ #4
- [ ] `sitemap.xml` 自動生成（`next-sitemap` または `app/sitemap.ts`）→ #6
- [ ] `robots.txt` → #6
- [ ] OG 画像（1200x630）デザイン1種類作成 → #4

### 1.5 テスト

- [x] ユニットテスト: ドメインロジック網羅（37/37）
- [ ] コンポーネントテスト: C1〜C6 → #9
- [ ] E2E（Playwright）: E1〜E10 → #10
- [x] CI でテスト自動実行（PR #1 で導入済）

---

## フェーズ 2: 銘柄スクリーニング（拡張、MVP公開後）→ EPIC #16

サブタスクは EPIC #16 のチェックリストで管理。スキーマ仕様書は #17。

---

## フェーズ 3: 認証＋クイズ（拡張）→ EPIC #18

---

## フェーズ 4: マルチモーダル・拡張 → EPIC #19

---

## インフラ・デプロイ（フェーズ1と並行）

### I.1 コンテナ化

- [ ] `Dockerfile`（Next.js standalone 出力でマルチステージビルド）
- [ ] `.dockerignore`
- [ ] ローカルでイメージビルド検証（`make docker-build`）

### I.2 GCP セットアップ

- [x] GCP プロジェクト作成: `invest-assist-prod`（billing 紐付け済）
- [x] API 有効化: run / artifactregistry / cloudbuild / iam / iamcredentials / sts
- [x] Artifact Registry: `asia-northeast1/invest-assist`
- [x] Cloud Run サービス初回デプロイ（GitHub Actions 経由、2m56s）
- [x] サービス URL: https://invest-assist-upj37vyhzq-an.a.run.app
- [ ] Cloud SQL インスタンス作成（フェーズ2着手時）→ #16 のサブ
- [ ] Secret Manager にシークレット登録（フェーズ3で NextAuth Secret 等）→ #18 のサブ
- [ ] カスタムドメイン設定（任意）→ #20
- [x] `NEXT_PUBLIC_APP_URL` を Cloud Run 環境変数に設定（リビジョン invest-assist-00002-d8s に反映済）

### I.3 GitHub Actions

- [x] `.github/workflows/ci.yml` — PR/push で Lint/tsc/test/build（PR #1、1m19s で green）
- [x] `.github/workflows/deploy.yml` — main push で Cloud Run へデプロイ（PR #2、2m56s で green）
- [x] WIF (Workload Identity Federation) — github-pool/github-provider、リポジトリスコープ制限付き
- [x] deploy URL を GHA ジョブサマリーに出力
- [ ] PR コメントへの URL 自動投稿（プレビュー環境構築時に追加）
- [x] Branch protection: main は PR + CI green 必須（Ruleset、`current_user_can_bypass: never`）
- [ ] deploy.yml に paths-ignore で docs 変更を除外 → #13
- [ ] GitHub Actions Node 20→24 移行 → #14

### I.4 監視 → #12 で統合

- [ ] Cloud Logging で標準出力確認 → #12
- [ ] Cloud Error Reporting 有効化 → #12
- [ ] アラート: エラー率 > 5%、レイテンシ p95 > 2s → #12
- [ ] uptime チェック（無料枠で）→ #12

---

## ドキュメント

- [x] 画面定義書 `docs/screen-spec.md`（手順⑩）— 全画面の UI/URL/状態遷移/デザイントークン
- [x] API 仕様書 `docs/api-spec.md`（手順⑪）— URL クエリ仕様 + Phase 2 以降の HTTP API 予定
- [x] テスト仕様書 `docs/test-spec.md`（手順⑫）— 37件のテスト一覧 + E2E 計画 + カバレッジ目標
- [x] ドキュメントインデックス `docs/README.md`
- [ ] Prisma スキーマ定義書 `docs/db-schema.md`（手順⑮、フェーズ2前）→ #17
- [ ] テスト仕様書の自動生成（保守性）→ #21

---

## ガードレール（手順⑬〜⑳と整合）

- [ ] ESLint 9 + @typescript-eslint 設定（手順⑬⑰）
- [ ] CI で `npm run lint` 必須化（手順⑭）
- [ ] Husky で pre-commit に lint / tsc / test を仕込む（手順⑯⑲）
- [ ] CI/CD（GitHub Actions → Cloud Run）（手順⑳）
- [ ] Makefile に `make init / dev / lint / test / build / deploy` を集約

---

## 進捗ダッシュボード

| フェーズ          | タスク総数 | 完了 | 状態                                   |
| ----------------- | ---------- | ---- | -------------------------------------- |
| 0. 初期化         | 29         | 23   | 進行中（79%）                          |
| 1. MVP            | 37         | 19   | 進行中（51%、1.1+1.2 完了）            |
| 2. スクリーニング | 9          | 0    | 未着手                                 |
| 3. 認証・クイズ   | 7          | 0    | 未着手                                 |
| 4. 拡張           | 4          | 0    | 未着手                                 |
| インフラ          | 16         | 11   | 進行中（69%、本番デプロイ完了）        |
| ドキュメント      | 5          | 4    | 進行中（80%、Prisma スキーマ書のみ残） |
| ガードレール      | 5          | 0    | 未着手                                 |

**次にやること**: GitHub Issues #4〜#21 から優先順に着手。直近の P1 候補:

- **#4**（OG / Twitter メタ）— SNS 流入のため、1〜2 時間
- **#5**（カスタム 404 / error.tsx）— 1 時間
- **#6**（sitemap.xml / robots.txt）— 30 分
- **#10**（E2E E1〜E10）— Phase 1 完成度の鍵、半日

**完了**: #11（ブランチ保護）— Public 化 + Ruleset 16387866 適用

## GitHub Issues 一覧

| #   | タイトル                                           | 優先度 |
| --- | -------------------------------------------------- | ------ |
| #4  | feat(seo): OG / Twitter メタタグと OG 画像         | P1     |
| #5  | feat: カスタム 404 と error.tsx                    | P1     |
| #6  | feat(seo): sitemap.xml / robots.txt / 構造化データ | P1     |
| #7  | test(a11y): 全画面の a11y / レスポンシブ検証       | P1     |
| #8  | test: Lighthouse CI 導入と本番計測                 | P1     |
| #9  | test: コンポーネントテスト C1〜C6                  | P1     |
| #10 | test: E2E テスト E1〜E10                           | P1     |
| #11 | infra: main ブランチ保護                           | P1     |
| #12 | infra: 本番監視                                    | P2     |
| #13 | infra: deploy.yml paths-ignore                     | P2     |
| #14 | infra: Node 20→24 移行                             | P2     |
| #15 | chore: LICENSE                                     | P2     |
| #16 | [EPIC] Phase 2: スクリーニング                     | P2     |
| #17 | docs: Prisma スキーマ定義書                        | P2     |
| #18 | [EPIC] Phase 3: 認証 + クイズ                      | P3     |
| #19 | [EPIC] Phase 4: マルチモーダル他                   | P3     |
| #20 | infra: カスタムドメイン                            | P3     |
| #21 | refactor(test): test-spec.md 自動生成              | P2     |

**本番URL**: https://invest-assist-upj37vyhzq-an.a.run.app

## レビュー履歴

| 日付       | レビュアー          | 対象               | 主な指摘                                                                                                                                                                                                                                                                                    | 対応                                                               |
| ---------- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 2026-05-14 | Codex役エージェント | 初期スキャフォルド | C1-C3, H1-H6, M4-M8, L5 など計15件（lint script / husky / Tailwind beta / Noto Sans JP subsets / Dockerfile 不在 / typedRoutes / フォント変数不整合 / vitest types）                                                                                                                        | 全て修正済み                                                       |
| 2026-05-14 | Codex役エージェント | ドメインロジック   | C1: annuity-due/ordinary の解釈ズレ（業界標準と50万円差） / H3: 負利率の仕様ブレ / H4: `z.coerce.number` の空文字silent 0 / H5: `fromSearchParams` が ZodError throw → 500 リスク / M5: テスト境界がガバくC1を検知できない / H1: readonly 不足 / H2: O(n×m) / L2: フィールド名 / N1-N5 など | C1/H3/H4/H5/M5/H1/L2/N1/N5 を修正、H2/M1-M4 などは次フェーズで対応 |

---

**最終更新**: 2026-05-14
