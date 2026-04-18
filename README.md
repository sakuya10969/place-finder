# place-finder

ユーザーの現在地 GPS 情報をもとに、近くの店舗をジャンルごとに検索・表示し、おすすめ順で提示するサービス。

既存の地図アプリやグルメサイトは情報量が多すぎて「今すぐ行ける良い店」を判断しづらい。place-finder はシンプルかつ的確なおすすめ体験を提供する。

## 主な機能

- 現在地ベースで近隣店舗をジャンル別に検索・一覧表示
- ルールベースの重みづけ（距離・評価・営業状況）によるおすすめ順ソート
- 店舗の基本情報（名前・ジャンル・距離・評価・営業状況）の閲覧
- 地図上での店舗位置の視覚的把握

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| ランタイム / パッケージマネージャー | Bun |
| 言語 | TypeScript |
| モノレポ管理 | Bun workspaces |
| リンター / フォーマッター | Biome |
| フロントエンド | React 19 + Vite + Mantine UI |
| データ取得 | TanStack React Query |
| バックエンド | Elysia (Bun) |
| スキーマ / OpenAPI | TypeBox + @elysiajs/swagger |
| API クライアント生成 | Orval |
| 外部 API | Google Maps Platform / Places API |
| 地図表示 | @vis.gl/react-google-maps |

## プロジェクト構成

```
place-finder/
├── apps/
│   ├── api/          # バックエンド API サーバー（Elysia）
│   └── web/          # フロントエンド SPA（React + Vite）
├── packages/
│   └── api-client/   # OpenAPI から Orval で自動生成された API クライアント・型定義
└── docs/             # プロジェクトドキュメント
```

| パッケージ | 責務 |
|---|---|
| `apps/api` | バックエンド API。外部 API 連携、推薦ロジック、データ加工 |
| `apps/web` | ユーザー向け SPA。UI 表示、ユーザー操作、データ取得 |
| `packages/api-client` | OpenAPI スキーマから自動生成された API クライアントと型定義 |

## セットアップ

### 前提条件

- [Bun](https://bun.sh/) がインストールされていること
- Google Maps Platform の API キーを取得済みであること

### インストール

```bash
bun install
```

### 環境変数の設定

```bash
cp .env.example apps/api/.env
```

`apps/api/.env` を編集し、API キーと推薦パラメータを設定する:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

RECOMMENDATION_WEIGHT_DISTANCE=0.5
RECOMMENDATION_WEIGHT_RATING=0.35
RECOMMENDATION_WEIGHT_OPEN=0.15
```

### 開発サーバーの起動

```bash
# API + Web を同時起動
bun run dev

# 個別に起動する場合
bun run dev:api   # バックエンド（http://localhost:3000）
bun run dev:web   # フロントエンド（http://localhost:5173）
```

開発時、フロントエンドからの `/api` リクエストは Vite proxy 経由でバックエンドに転送される。

## 主要コマンド

```bash
bun run dev           # 全アプリの開発サーバー起動
bun run build         # 全アプリのビルド
bun run generate      # OpenAPI スキーマ生成 → API クライアント生成
bun run typecheck     # 全パッケージの型チェック
bun run lint          # Biome によるリント
bun run format        # Biome によるフォーマット
bun run check         # Biome によるリント + フォーマット（自動修正）
```

## アーキテクチャ

### バックエンドファースト設計

API の追加・変更は以下の順序で行う:

1. バックエンドの `schema.ts` に TypeBox でスキーマを定義
2. `route.ts` で Elysia ルートに適用し、API を実装
3. `bun run generate` で OpenAPI スキーマ → Orval クライアント生成
4. フロントエンドで生成物を import して利用

TypeBox スキーマが API 契約の Single Source of Truth であり、この順序を逆転させない。

### バックエンド（モジュラーモノリス）

```
apps/api/src/
├── index.ts            # エントリポイント
├── places/             # 店舗検索モジュール
│   ├── route.ts        # ルーティング定義
│   ├── schema.ts       # TypeBox スキーマ
│   ├── service.ts      # ビジネスロジック
│   └── client.ts       # Google Places API クライアント
├── recommendation/     # 推薦ロジックモジュール
│   ├── schema.ts       # TypeBox スキーマ
│   ├── service.ts      # スコアリング統合
│   └── scorer.ts       # 重みづけスコアリング
└── shared/             # 共通処理（エラーハンドリング等）
```

### フロントエンド（FSD: Feature-Sliced Design）

```
apps/web/src/
├── app/        # アプリ初期化、プロバイダー
├── pages/      # ページ単位のコンポーネント
├── features/   # ユーザー操作を伴う機能単位（検索、地図等）
├── entities/   # ドメインモデルの表示（店舗カード等）
└── shared/     # 共通ユーティリティ、フック
```

## API エンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/health` | ヘルスチェック |
| GET | `/api/places/search` | 店舗検索（lat, lng, radius, type） |

OpenAPI ドキュメントは開発サーバー起動時に `/swagger` で閲覧可能。

## ドキュメント

詳細なドキュメントは `docs/` ディレクトリを参照:

- [プロジェクト概要](docs/project-overview.md)
- [機能一覧](docs/features.md)
- [技術スタック](docs/tech-stack.md)
- [アーキテクチャ思想](docs/architecture-philosophy.md)
- [ドメイン設計](docs/domain-design.md)
- [API デザイン](docs/api-design.md)
- [仕様一覧](docs/specs.md)

## ライセンス

Private
