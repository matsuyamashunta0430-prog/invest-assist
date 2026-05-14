# CLAUDE.md — invest-assist

> 投資初心者を最もアシストする Web アプリ。新NISA積立シミュレーター、日本株スクリーニング、ローソク足／チャートパターン学習を統合し、初心者が「正しい順番」で学び、迷わず行動できる状態に導くことを目的とする。

---

## 1. 基本情報

| 項目 | 内容 |
|---|---|
| プロジェクト名 | invest-assist |
| リポジトリ | （GitHub に作成予定／後の手順 ㉑ で確定） |
| 開発開始日 | 2026-05-14 |
| 想定リリース | フェーズ1 MVP: 2026-07（約6週間） |
| 想定ユーザー | 日本在住の20〜40代、投資未経験〜初心者。新NISA を始めようとしている人 |
| 対応言語 | 日本語（UI／コンテンツ） |
| 対応デバイス | スマホ（優先）／PC（レスポンシブ） |
| ライセンス | プライベート（個人開発／公開前） |

---

## 2. プロジェクト概要

### 2.1 解決したい課題

1. 新NISA を始めたいが、何から学べばよいか分からない（情報が散乱）
2. 「PER／PBR／ROE／自己資本比率」などの指標を、教科書で覚えても **実銘柄で確認する手段** がない
3. ローソク足／チャートパターンを **クイズ形式で身につける** 良いツールが少ない
4. 積立金額をいくらにすればよいか、複利計算を直感的に試せるツールが必要

### 2.2 提供価値（オールインワン）

| 機能 | 価値 |
|---|---|
| NISA積立シミュレーター | 「いくらを何年積み立てるとどうなるか」を即時可視化 |
| 銘柄スクリーニング | 手書きノートの条件（時価総額・PER・自己資本比率等）でフィルタ |
| パターン学習（クイズ） | ローソク足／チャートパターンを4択クイズで定着 |

### 2.3 フェーズ計画

- **フェーズ1 (MVP)**: NISA積立シミュレーター単独（認証なし）。最小構成で公開。
- **フェーズ2**: 銘柄スクリーニング機能を追加（無料の上場銘柄CSV／J-Quants API 等を利用）。
- **フェーズ3**: パターン学習クイズ＋ユーザー認証＋進捗保存。
- **フェーズ4**: マルチモーダル対応（チャート画像をアップロードしてパターン判定）／コミュニティ機能。

---

## 3. 技術スタック

### 3.1 フロントエンド

| 項目 | 採用 | 理由 |
|---|---|---|
| 言語 | TypeScript 5.x | 型安全 |
| フレームワーク | Next.js 15 (App Router) | SSR/SSG、Cloud Run と相性良好 |
| スタイル | Tailwind CSS v4 | 高速開発、shadcn/ui との互換 |
| UI コンポーネント | shadcn/ui | アクセシブル、コピー＆編集前提 |
| グラフ | Recharts | 軽量、Next.js と相性◎ |
| フォーム | React Hook Form + Zod | 型安全バリデーション |
| 状態管理 | TanStack Query (Server State) + Zustand (Client State) | API キャッシュと UI 状態を分離 |

### 3.2 バックエンド

| 項目 | 採用 | 理由 |
|---|---|---|
| 実行環境 | Next.js Route Handlers (App Router の API) | フロント／バック一体運用 |
| ORM | Prisma 5.x | 型生成、マイグレーション、後手順⑮で本格利用 |
| DB | PostgreSQL 16 (Cloud SQL) | Prisma 公式サポート、Cloud Run 標準 |
| 認証（フェーズ3〜） | NextAuth.js (Auth.js v5) + Google OAuth | 実装容易、保守容易 |
| バリデーション | Zod | フロント／バックで共有 |
| 外部 API | J-Quants API（フェーズ2）／その他無料の株価API | 銘柄情報、財務指標 |

### 3.3 開発支援

| 項目 | 採用 |
|---|---|
| パッケージマネージャ | pnpm |
| Lint | ESLint 9 (flat config) + @typescript-eslint |
| Format | Prettier 3 |
| Test | Vitest（unit）＋ Playwright（E2E） |
| Pre-commit | Husky + lint-staged |
| 型チェック | `tsc --noEmit` |

---

## 4. インフラストラクチャ

| 項目 | 内容 |
|---|---|
| ホスティング | Google Cloud Run（コンテナ） |
| DB | Google Cloud SQL for PostgreSQL（小規模インスタンス） |
| ストレージ | Cloud Storage（画像・静的アセット用、フェーズ4〜） |
| CDN | Cloud CDN（必要に応じて） |
| シークレット | Secret Manager（DB接続文字列、OAuthクライアントシークレット） |
| CI/CD | GitHub Actions → Artifact Registry → Cloud Run |
| 監視 | Cloud Logging + Cloud Error Reporting |
| ドメイン | 後日取得（暫定: Cloud Run デフォルトドメイン） |

### 4.1 デプロイ構成図（テキスト）

```
[Browser] ─HTTPS→ [Cloud Run: invest-assist-web]
                       │
                       ├─→ [Cloud SQL: PostgreSQL]
                       ├─→ [Secret Manager]
                       └─→ [Cloud Logging]

[GitHub main push] → [GitHub Actions]
   ├ build container (Dockerfile)
   ├ push to Artifact Registry
   └ deploy to Cloud Run
```

---

## 5. 技術要件

### 5.1 非機能要件

| 項目 | 要件 |
|---|---|
| パフォーマンス | LCP < 2.5s、INP < 200ms（Lighthouse 90+） |
| 可用性 | 99.5%（Cloud Run 既定で十分） |
| スケーラビリティ | Cloud Run 自動スケール（最大10インスタンスから開始） |
| セキュリティ | HTTPS強制、CSP設定、Secret Manager 利用、依存パッケージ脆弱性スキャン（GitHub Dependabot） |
| アクセシビリティ | WCAG 2.1 AA 準拠（shadcn/ui ベース） |
| 国際化 | 日本語のみ（将来 i18n 拡張可能な構造） |
| ブラウザ対応 | Chrome / Safari / Edge / Firefox の最新2バージョン |

### 5.2 開発要件

- Node.js 20 LTS
- pnpm 9.x
- Docker Desktop（ローカル DB／本番イメージ検証）
- gcloud CLI（デプロイ）
- 全 PR で Lint / Type-check / Test が通ること（GitHub Actions で必須化）

---

## 6. 機能要件

### 6.1 フェーズ1（MVP）必須機能

#### F1: NISA積立シミュレーター

- **入力**: 毎月積立額（円）、想定年利（%）、積立期間（年）、初期投資額（任意）
- **計算**: 月次複利で資産推移を計算
- **出力**:
  - 折れ線グラフ（元本／評価額／利益）
  - サマリーカード（最終評価額、総積立額、利益額、利益率）
  - 「+100万になる年」など分かりやすいマイルストーン
- **デフォルト値**: 月3万円／年利5%／20年（オルカン想定）
- **共有**: URL クエリパラメータで条件を保存・共有可能

#### F2: 学習コンテンツ静的ページ

- 新NISA とは／インデックス投資とは／よくある失敗 の3ページ
- 当レポートの動画10本・ブログ10本リストを掲載（外部リンク）

#### F3: 共通レイアウト

- トップページ／グローバルナビ／フッター／OG画像

### 6.2 フェーズ2（拡張）

- F4: 銘柄スクリーニング（時価総額・PER・自己資本比率・配当性向・連続増配年数）
- F5: お気に入り銘柄リスト（ローカル保存）

### 6.3 フェーズ3（拡張）

- F6: Google ログイン
- F7: クイズ機能（ローソク足／チャートパターン）
- F8: 進捗・正答率の記録

---

## 7. UI/UX 設計

### 7.1 デザイン原則

1. **モバイルファースト** … 通勤時間に片手で操作できる
2. **数字より直感** … グラフと色で「上がった／下がった」を即座に伝える
3. **専門用語ゼロ** … 初出時は必ず1行説明
4. **「次に何をすべきか」を毎ページで提示** … 学習動線を切らさない

### 7.2 画面一覧（フェーズ1）

| ID | 画面 | 主要要素 |
|---|---|---|
| S0 | トップ | ヒーロー＋3機能カード＋CTA「シミュレーターを試す」 |
| S1 | 積立シミュレーター | 入力フォーム／グラフ／サマリー／シェアボタン |
| S2 | 学べる動画 | 動画10本リスト（カード形式） |
| S3 | 学べるブログ | ブログ10本リスト |
| S4 | よくある失敗 | 失敗例まとめ＋対処法 |
| S5 | About / 免責事項 | 投資助言ではない旨を明記 |

### 7.3 カラー／タイポ

- カラー: 緑（#16A34A 上昇）／赤（#DC2626 下落）／紺（#0F172A プライマリ）／白系背景
- フォント: Inter（英数）＋ Noto Sans JP（和文）
- 角丸: `rounded-xl` 基準
- ダークモード: フェーズ2で対応

---

## 8. デプロイ手順

### 8.1 ローカル開発

```bash
make init           # 依存インストール、.env 生成、DB マイグレーション
make dev            # http://localhost:3000 で起動
make test           # vitest
make lint           # eslint + prettier --check
```

### 8.2 本番デプロイ（手動）

```bash
make build          # Next.js ビルド
make docker-build   # コンテナイメージ作成
make deploy         # Artifact Registry → Cloud Run
```

### 8.3 CI/CD（GitHub Actions）

- `main` への push で自動的に:
  1. Lint / Type-check / Test を実行
  2. Docker イメージをビルドし Artifact Registry に push
  3. Cloud Run にデプロイ
  4. デプロイ URL を PR コメントに自動投稿

詳細は `Makefile` と `.github/workflows/deploy.yml` を参照。

### 8.4 シークレット管理

| シークレット | 保管場所 |
|---|---|
| `DATABASE_URL` | Secret Manager → Cloud Run 環境変数注入 |
| `NEXTAUTH_SECRET` | Secret Manager（フェーズ3〜） |
| `GOOGLE_CLIENT_ID/SECRET` | Secret Manager（フェーズ3〜） |
| `JQUANTS_API_TOKEN` | Secret Manager（フェーズ2〜） |

ローカル開発では `.env.local`（gitignore）を使用。`.env.example` をコミットし変数名を共有。

---

## 9. 今後の拡張可能性

| 拡張 | 概要 |
|---|---|
| マルチモーダル対応 | チャート画像をアップロード → AI（Claude API）でローソク足パターン判定／支持線抵抗線提案 |
| iDeCo シミュレーター | 節税効果を含めた長期試算 |
| ポートフォリオ管理 | 保有銘柄の損益追跡、リバランス提案 |
| LINE Bot 連携 | 毎月の積立リマインドと暴落時の励まし配信 |
| コミュニティ機能 | 学習進捗の共有、初心者同士の Q&A |
| 多言語化 | 英語／中国語対応（在日外国人向け） |
| モバイルアプリ化 | React Native / Expo で iOS・Android ネイティブ展開 |
| データソース拡充 | EDINET XBRL から直接財務指標を取得 |

---

## 10. 守るべきガードレール（Claude Code 向け）

このセクションは Claude Code が作業する際の必須ルール。

1. **コミット前**: `npm run lint` `npm run tsc` `npm run test` がすべて通ること（Husky で自動）
2. **新規ライブラリ導入時**: `use context7` で最新ドキュメントを必ず確認
3. **DB スキーマ変更**: Prisma マイグレーションを必ず生成し、PR に含める
4. **シークレット**: コードや `.env.example` に値を書かない。Secret Manager を使う
5. **ブランチ運用**: Issue 番号付きブランチ（`feat/#12-simulator`）／PR は Issue にリンク
6. **テスト**: 新機能には最低1つの単体テストを追加
7. **アクセシビリティ**: shadcn/ui の標準を崩さない／コントラスト比4.5以上
8. **依存追加**: 重量級ライブラリは事前に bundle size を確認

---

## 11. 参考資料

- 学習レポート: `C:\Users\matth\.claude\investment-beginner-report.md`
- 金融庁 NISA 特設サイト: https://www.fsa.go.jp/policy/nisa2/
- Next.js App Router: https://nextjs.org/docs/app
- Prisma: https://www.prisma.io/docs
- Cloud Run: https://cloud.google.com/run/docs

---

**最終更新**: 2026-05-14
