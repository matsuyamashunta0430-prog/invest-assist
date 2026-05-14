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

## `deploy.yml` — Cloud Run へのデプロイ

| 項目     | 内容                                                        |
| -------- | ----------------------------------------------------------- |
| トリガー | `main` への push、手動実行 (`workflow_dispatch`)            |
| 認証     | WIF (Workload Identity Federation) で OIDC トークン交換     |
| ビルド   | Docker マルチステージビルド（Dockerfile）                   |
| プッシュ | Artifact Registry（asia-northeast1）                        |
| デプロイ | Cloud Run（min=0 / max=5 / 1CPU / 512Mi / unauthenticated） |
| 同時実行 | 同じ ref のキューイング（キャンセルしない）                 |

GitHub Variables（リポジトリ単位）:

- `GCP_PROJECT_ID` = invest-assist-prod
- `GCP_WIF_PROVIDER` = projects/420732943271/locations/global/workloadIdentityPools/github-pool/providers/github-provider
- `GCP_SERVICE_ACCOUNT` = deploy-sa@invest-assist-prod.iam.gserviceaccount.com
- `GCP_REGION` = asia-northeast1
- `GCP_ARTIFACT_REPO` = invest-assist

---

## 旧版メモ — `deploy.yml`（次フェーズで追加予定）

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
