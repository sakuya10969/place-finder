# 完了タスク履歴 — place-finder

## 2026-04-18

`docs/tasks.md` の初期実装タスクを完了。

### Phase 1: バックエンド基盤

- `apps/api/src/` 配下に `places/`, `recommendation/`, `shared/` を作成し、モジュール構成を整備
- 共通エラーハンドリングを実装し、`VALIDATION_ERROR`, `INTERNAL_ERROR`, `EXTERNAL_API_ERROR` を統一レスポンス化
- 環境変数管理を実装し、`.env.example` を追加
- API キーはユーザー指定に合わせて `GOOGLE_MAPS_API_KEY` を優先しつつ `GOOGLE_PLACES_API_KEY` も互換対応

### Phase 2: バックエンド — 店舗検索 API

- Google Places API (New) Nearby Search を呼び出す `places/client.ts` を実装
- TypeBox ベースの検索クエリ / レスポンススキーマを実装
- Haversine による距離計算を含む `places/service.ts` を実装
- `GET /api/places/search` をルーティングし、Elysia に登録

### Phase 3: バックエンド — 推薦ロジック

- 重み付きスコアリングを `recommendation/scorer.ts` に実装
- `recommendation/service.ts` でスコア付与と降順ソートを実装
- `ScoredPlace` スキーマを定義
- 店舗検索 API に `score` を統合

### Phase 4: OpenAPI ドキュメント出力

- `apps/api/src/openapi.ts` を作成し、`apps/api/openapi.json` を出力可能にした
- `apps/api/package.json` に `openapi:generate` スクリプトを追加
- Orval 互換のため、OpenAPI JSON を pretty print しつつ `const` / `nullable` / response description を正規化
- `/health`, `/api/places/search` を含むことを確認

### Phase 5: API クライアント生成

- `packages/api-client/` に `orval.config.ts` と axios mutator を追加
- `bun add` で `axios`, `@tanstack/react-query`, `orval` を導入
- ルート `package.json` に `generate` スクリプトを追加
- Orval で TanStack Query フック付きクライアントを生成する流れを整備

### Phase 6: フロントエンド基盤

- `bun add` で Mantine, Notifications, Google Maps ラッパーを導入
- `postcss.config.cjs` と Mantine テーマを追加
- `apps/web/src/` を `app/`, `pages/`, `features/`, `entities/`, `shared/` に再構成
- Mantine AppShell でヘッダー + メインコンテンツ構成を実装
- 手書きの `lib/api.ts` を削除し、Orval 生成クライアントへ移行

### Phase 7: フロントエンド — 店舗検索 UI

- Geolocation API ベースの現在地取得フックを実装
- ジャンルフィルタ UI と半径切り替え UI を実装
- Orval 生成 React Query フックで店舗検索 API を接続
- おすすめ順の店舗カード一覧、ローディング Skeleton、エラー通知を実装

### Phase 8: フロントエンド — 地図表示

- `@vis.gl/react-google-maps` を導入
- 現在地中心の地図コンポーネントを実装
- 店舗マーカーと現在地マーカーを実装
- マーカー選択時の InfoWindow 表示を実装

### Phase 9: フロントエンド — レイアウト統合

- デスクトップで一覧 + 地図の 2 カラムレイアウトを実装
- モバイルで `Mantine Tabs` による一覧 / 地図切り替えを実装
- `pages/home/ui/home-page.tsx` で検索フロー全体を統合

### 検証

- `bun run --filter @place-finder/api typecheck`
- `bun run --filter @place-finder/api-client typecheck`
- `bun run --filter @place-finder/web typecheck`
- `bun run --filter @place-finder/web build`
- `bun run generate`
