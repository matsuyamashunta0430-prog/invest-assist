# GitHub Actions ワークフロー

## `ci.yml` — Continuous Integration

| 項目         | 内容                                              |
| ------------ | ------------------------------------------------- |
| トリガー     | `main` への push、`main` への PR                  |
| 同時実行制御 | 同一 ref では新しいラン優先（キャンセル古い）     |
| ジョブ       | `verify` — Ubuntu 24.04 / Node 20 / pnpm 9.15.9   |
| ステップ     | install → lint → tsc → test → build               |
| タイムアウト | 10 分                                             |
| キャッシュ   | pnpm store（actions/setup-node の `cache: pnpm`） |

このワークフローが green になることが、PR を main にマージする前提です。

## `deploy.yml`（次フェーズで追加予定）

- WIF (Workload Identity Federation) で GCP へ OIDC 認証
- `gcloud builds submit` で Artifact Registry へイメージ push
- `gcloud run deploy` で Cloud Run へ反映
- デプロイ URL を PR コメントに自動投稿

事前準備：

1. GCP プロジェクト `invest-assist-prod` 作成 + billing 紐付け
2. 必要 API 有効化: `run.googleapis.com`, `artifactregistry.googleapis.com`, `cloudbuild.googleapis.com`, `iam.googleapis.com`, `iamcredentials.googleapis.com`, `sts.googleapis.com`
3. Artifact Registry リポジトリ作成（`asia-northeast1`）
4. WIF Pool + Provider 作成
5. デプロイ用サービスアカウント作成 + ロール付与（Cloud Run Admin, Artifact Registry Writer, Service Account User, Cloud Build Editor）
6. GitHub Secrets/Variables 設定:
   - `GCP_PROJECT_ID`
   - `GCP_WIF_PROVIDER`（projects/.../locations/global/workloadIdentityPools/.../providers/...）
   - `GCP_SERVICE_ACCOUNT`（deploy-sa@invest-assist-prod.iam.gserviceaccount.com）
