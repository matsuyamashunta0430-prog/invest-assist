# API 仕様書

> invest-assist の内部 API および外部 API 連携の仕様。Phase 1 (MVP) では HTTP API は未実装。クライアント計算と URL クエリパラメータ仕様のみが対象。Phase 2 以降の HTTP API は「予定」として記載。

最終更新: 2026-05-14

---

## 1. 全体方針

- **REST 風** の HTTP API（Next.js App Router の Route Handlers `src/app/api/...`）を採用予定
- リクエスト／レスポンスのスキーマは **Zod で一元定義**、フロント・バック両方で再利用
- エラーレスポンスは **RFC 7807 (Problem Details for HTTP APIs)** 形式を踏襲
- 認証は Phase 3 で NextAuth.js (Auth.js v5) のセッション Cookie を利用
- レート制限は Phase 3 で `@upstash/ratelimit` + Redis（Cloud Memorystore）を導入

---

## 2. Phase 1 — 現状の「API」相当の仕様

Phase 1 では HTTP API は存在せず、すべての計算はクライアントサイドで完結する。**URL クエリパラメータ**が事実上の API として機能している。

### 2.1 シミュレーター URL クエリ

`/simulator?initial=&monthly=&rate=&years=`

| パラメータ | 型   | 必須 | デフォルト | min / max          |
| ---------- | ---- | ---- | ---------- | ------------------ |
| `initial`  | 整数 | ×    | 0          | 0 〜 1,000,000,000 |
| `monthly`  | 整数 | ×    | 30000      | 0 〜 1,000,000     |
| `rate`     | 数値 | ×    | 5          | 0 〜 30            |
| `years`    | 整数 | ×    | 20         | 1 〜 50            |

**ルール**:

- すべて欠落しても安全（Zod の `default()` で埋まる）
- 範囲外・非数値はサイレントに **デフォルトへフォールバック**（Server で 500 を出さない方針）
- 重複キー `?monthly=1&monthly=2` は最初の値を採用
- 空文字 `?monthly=` は欠落として扱う（0 ではない）

**サンプル**:

```text
正常: /simulator?monthly=50000&rate=7&years=30
省略: /simulator → デフォルト値で動作
不正: /simulator?rate=999&years=abc → 全項目デフォルトに落とす
```

**実装**: `src/lib/simulator/schema.ts` の `fromSearchParams` 関数。`safeParse` + フォールバック設計。

### 2.2 ドメイン関数 API（クライアント内）

シミュレーターのドメインロジックは公開関数として `src/lib/simulator/calculate.ts` に置かれる。テスト容易性と将来の API 化（Phase 2）を見据えて純関数で実装。

| 関数                                       | シグネチャ                                                       | 説明                             |
| ------------------------------------------ | ---------------------------------------------------------------- | -------------------------------- |
| `simulate(input)`                          | `(SimulationInput) => readonly SimulationPoint[]`                | 月次複利を期末払いで計算         |
| `summarize(points)`                        | `(readonly SimulationPoint[]) => SimulationSummary`              | 最終値・元本・利益・利益率を集計 |
| `findProfitMilestones(points, thresholds)` | `(readonly SimulationPoint[], readonly number[]) => Milestone[]` | 利益しきい値の到達月             |
| `validateInput(input)`                     | `(SimulationInput) => void`                                      | 範囲・型チェック、不正なら throw |

詳細は当該ファイルの JSDoc を参照。

---

## 3. Phase 2 以降 — HTTP API 予定仕様

> 以下は未実装の予定仕様。実装時にこのドキュメントを更新する。

### 3.1 銘柄スクリーニング `POST /api/screening`

**用途**: 条件に合致する日本株銘柄を返す。

**リクエスト**:

```json
{
  "marketCap": { "max": 10000000000 },
  "per": { "min": 10, "max": 15 },
  "pbr": { "max": 1 },
  "roe": { "min": 8 },
  "equityRatio": { "min": 40 },
  "payoutRatio": { "max": 50 },
  "consecutiveDividendYears": { "min": 5 },
  "sort": { "field": "marketCap", "order": "asc" },
  "limit": 50,
  "offset": 0
}
```

**レスポンス**:

```json
{
  "total": 27,
  "items": [
    {
      "code": "9999",
      "name": "サンプル株式会社",
      "market": "東証プライム",
      "marketCap": 8500000000,
      "per": 12.3,
      "pbr": 0.95,
      "roe": 9.4,
      "equityRatio": 52.1,
      "payoutRatio": 31.2,
      "consecutiveDividendYears": 8
    }
  ]
}
```

**エラー**:

| HTTP | エラータイプ       | 原因                          |
| ---- | ------------------ | ----------------------------- |
| 400  | `validation_error` | リクエスト形式が不正          |
| 503  | `data_unavailable` | J-Quants からのデータ取得失敗 |

### 3.2 銘柄詳細 `GET /api/stocks/{code}`

**レスポンス**:

```json
{
  "code": "9999",
  "name": "サンプル株式会社",
  "market": "東証プライム",
  "indicators": {
    "marketCap": 8500000000,
    "per": 12.3,
    "pbr": 0.95,
    "roe": 9.4,
    "equityRatio": 52.1,
    "payoutRatio": 31.2,
    "consecutiveDividendYears": 8
  },
  "history": {
    "salesGrowth3y": "ascending",
    "operatingIncomeGrowth3y": "ascending"
  },
  "updatedAt": "2026-05-14T00:00:00Z"
}
```

**エラー**:

| HTTP | エラータイプ | 原因                       |
| ---- | ------------ | -------------------------- |
| 404  | `not_found`  | 該当銘柄コードが存在しない |

### 3.3 認証 `/api/auth/...` （NextAuth.js）

NextAuth.js (Auth.js v5) が `/api/auth/[...nextauth]/route.ts` で自動的にハンドル。エンドポイント:

- `GET /api/auth/providers`
- `GET /api/auth/csrf`
- `POST /api/auth/signin/google`
- `POST /api/auth/signout`
- `GET /api/auth/session`

Cookie: `next-auth.session-token`（HttpOnly, SameSite=Lax, Secure）

### 3.4 ユーザー情報 `GET /api/me`

セッション必須。

**レスポンス**:

```json
{
  "id": "usr_xxxx",
  "email": "user@example.com",
  "name": "山田太郎",
  "createdAt": "2026-05-14T00:00:00Z"
}
```

**エラー**: 401 `unauthorized`

### 3.5 お気に入り銘柄 `/api/me/favorites`

| メソッド | パス                       | 用途                   |
| -------- | -------------------------- | ---------------------- |
| `GET`    | `/api/me/favorites`        | 一覧取得               |
| `POST`   | `/api/me/favorites`        | 追加（body: `{code}`） |
| `DELETE` | `/api/me/favorites/{code}` | 削除                   |

### 3.6 クイズ `/api/quiz/...`

| メソッド | パス                                            | 用途                       |
| -------- | ----------------------------------------------- | -------------------------- |
| `GET`    | `/api/quiz/questions?category=candlestick&n=10` | 問題セット取得             |
| `POST`   | `/api/quiz/answer`                              | 解答提出（採点＋進捗保存） |
| `GET`    | `/api/quiz/progress`                            | ユーザーの正答率取得       |

---

## 4. 外部 API 連携

### 4.1 J-Quants API（Phase 2）

- 用途: 日本株の財務・株価データ取得
- 認証: API Token（Secret Manager 経由で注入）
- 利用エンドポイント: `/listed/info`, `/fins/statements`, `/fins/dividend`
- 取得頻度: 日次バッチ（Cloud Scheduler → Cloud Run Job）で更新

### 4.2 Anthropic Claude API（Phase 4）

- 用途: チャート画像をアップロード → ローソク足／支持線抵抗線判定
- 認証: API Key（Secret Manager）
- レート制限: ユーザー単位で月 N 回まで（無料枠の保護）

---

## 5. エラーレスポンス形式（RFC 7807 風）

```json
{
  "type": "validation_error",
  "title": "リクエストの検証に失敗しました",
  "status": 400,
  "detail": "rate must be between 0 and 30",
  "instance": "/api/screening",
  "errors": [{ "field": "rate", "message": "must be <= 30" }]
}
```

| HTTP | type                  | 用途                 |
| ---- | --------------------- | -------------------- |
| 400  | `validation_error`    | リクエスト形式不正   |
| 401  | `unauthorized`        | 未認証               |
| 403  | `forbidden`           | 認証済みだが権限不足 |
| 404  | `not_found`           | リソース不存在       |
| 409  | `conflict`            | 競合（重複登録など） |
| 429  | `rate_limit_exceeded` | レート制限           |
| 500  | `internal_error`      | サーバー内部エラー   |
| 503  | `data_unavailable`    | 外部 API 障害        |

---

## 6. バージョニング方針

- URL ベースのバージョニングは Phase 1〜3 では採用しない（破壊的変更は事前に PR レビューで合意）
- Phase 4 以降で公開 API として外部利用が始まったら、`/api/v1/...` プレフィックスを導入
