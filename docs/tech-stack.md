# 技術スタック — place-finder

## 全体

| カテゴリ | 技術 | 用途 |
|---|---|---|
| ランタイム / パッケージマネージャー | Bun | 開発・ビルド・実行の統一ランタイム |
| モノレポ管理 | Bun workspaces | `apps/*`, `packages/*` のワークスペース管理 |
| リンター / フォーマッター | Biome | コード品質の一元管理 |
| 言語 | TypeScript | フロントエンド・バックエンド共通 |

## フロントエンド（apps/web）

| カテゴリ | 技術 | 用途 |
|---|---|---|
| UI フレームワーク | React 19 | コンポーネントベースの SPA 構築 |
| ビルドツール | Vite | 高速な開発サーバーとビルド |
| UI ライブラリ | Mantine UI | スタイル付きコンポーネント群 |
| データ取得 / サーバー状態管理 | TanStack React Query | キャッシュ、再取得、ローディング状態の宣言的管理 |
| スキーマ / バリデーション | Valibot | フォーム入力検証、API レスポンスのランタイム検証 |
| API クライアント生成 | Orval | OpenAPI → React Query フック・型定義の自動生成 |
| アーキテクチャ | FSD（Feature-Sliced Design） | 機能単位のコード整理 |
| 地図表示 | Google Maps JavaScript API | 店舗位置の地図表示 |

## バックエンド（apps/api）

| カテゴリ | 技術 | 用途 |
|---|---|---|
| Web フレームワーク | Elysia | 型安全なルーティング、OpenAPI 自動生成 |
| スキーマ / バリデーション | TypeBox | リクエスト/レスポンスの型定義、OpenAPI スキーマの Single Source of Truth |
| OpenAPI ドキュメント | @elysiajs/swagger | Elysia + TypeBox からの OpenAPI 自動生成 |
| CORS | @elysiajs/cors | クロスオリジンリクエストの許可 |
| アーキテクチャ | モジュラーモノリス | 機能モジュール単位のコード整理 |
| 外部 API | Google Maps Platform / Places API | 店舗データの取得・検索 |

## パッケージ構成

| パッケージ | 責務 |
|---|---|
| `apps/web` | ユーザー向け SPA。UI 表示、ユーザー操作、データ取得 |
| `apps/api` | バックエンド API サーバー。外部 API 連携、推薦ロジック、データ加工 |
| `packages/api-client` | OpenAPI スキーマから Orval で自動生成された API クライアントと型定義 |

## スキーマライブラリの使い分け

| レイヤー | ライブラリ | 用途 |
|---|---|---|
| フロントエンド | Valibot | フォームバリデーション、ランタイム検証 |
| バックエンド | TypeBox | API スキーマ定義、バリデーション、OpenAPI 生成 |

フロントエンドとバックエンドでスキーマライブラリを分けている理由:
- TypeBox は Elysia にネイティブ統合されており、OpenAPI 生成の基盤となる
- Valibot はバンドルサイズが小さく、フロントエンドのパフォーマンスに適している
- 両者の間は Orval による自動生成で型同期されるため、手動での整合性維持は不要

## API クライアント生成パイプライン

```
TypeBox スキーマ定義（バックエンド）
  → Elysia ルート実装
  → OpenAPI スキーマ自動生成（@elysiajs/swagger）
  → Orval でクライアント＆型生成（packages/api-client/generated/）
  → フロントエンドで import して利用
```

バックエンドファーストを徹底し、この順序を逆転させない。
