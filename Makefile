.PHONY: help init dev lint format test test-e2e tsc build docker-build deploy clean

PROJECT_ID ?= invest-assist-prod
REGION     ?= asia-northeast1
SERVICE    ?= invest-assist
ARTIFACT   ?= invest-assist
IMAGE      ?= $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(ARTIFACT)/$(SERVICE)

help: ## このヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

init: ## 初期セットアップ（依存インストール + .env 生成）
	pnpm install
	@if [ ! -f .env.local ]; then cp .env.example .env.local && echo "✓ .env.local 生成しました"; fi
	@pnpm husky init 2>/dev/null || true

dev: ## 開発サーバー起動
	pnpm dev

lint: ## Lint & Format チェック
	pnpm lint
	pnpm tsc

format: ## 自動フォーマット
	pnpm lint:fix

test: ## ユニットテスト
	pnpm test

test-e2e: ## E2E テスト
	pnpm test:e2e

tsc: ## 型チェック
	pnpm tsc

build: ## プロダクションビルド
	pnpm build

docker-build: ## Docker イメージビルド
	docker build -t $(SERVICE):latest .

deploy: ## Cloud Run デプロイ（手動・ローカルから）
	gcloud auth configure-docker $(REGION)-docker.pkg.dev --quiet --project $(PROJECT_ID)
	docker build -t $(IMAGE):latest .
	docker push $(IMAGE):latest
	gcloud run deploy $(SERVICE) \
		--image $(IMAGE):latest \
		--region $(REGION) \
		--platform managed \
		--allow-unauthenticated \
		--port 8080 \
		--min-instances 0 \
		--max-instances 5 \
		--cpu 1 \
		--memory 512Mi \
		--project $(PROJECT_ID)

clean: ## ビルド成果物を削除
	rm -rf .next out dist build coverage playwright-report test-results
