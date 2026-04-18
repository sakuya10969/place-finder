# ドメイン設計 — place-finder

## ドメイン概要

place-finder のドメインは「位置情報に基づく店舗検索と推薦」である。

主要なドメイン領域:
- 店舗検索（Places）: 外部 API を通じた店舗データの取得と加工
- 推薦（Recommendation）: 店舗データに対するスコアリングとソート

## エンティティ

### Place（店舗）

店舗検索の中心となるエンティティ。Google Places API から取得したデータを正規化した形で扱う。

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | Places API の place ID |
| name | string | 店舗名 |
| types | string[] | ジャンル（restaurant, cafe 等） |
| location | { lat: number, lng: number } | 座標 |
| rating | number \| null | 評価（0〜5） |
| isOpen | boolean \| null | 営業中かどうか |
| distance | number | 現在地からの距離（メートル） |

### SearchQuery（検索クエリ）

ユーザーの検索条件を表す値オブジェクト。

| フィールド | 型 | 説明 |
|---|---|---|
| lat | number | 緯度 |
| lng | number | 経度 |
| radius | number | 検索半径（メートル） |
| type | string \| null | ジャンルフィルタ |

### ScoredPlace（スコア付き店舗）

推薦ロジックによりスコアが付与された店舗。

| フィールド | 型 | 説明 |
|---|---|---|
| place | Place | 店舗エンティティ |
| score | number | 推薦スコア |

## サービス

### PlacesService

店舗検索のアプリケーションロジックを担当する。

責務:
- 検索クエリを受け取り、Places API クライアントを呼び出す
- API レスポンスを Place エンティティに変換する
- 距離計算を行う

配置: `apps/api/src/places/service.ts`

### RecommendationService

推薦ロジックのアプリケーションロジックを担当する。

責務:
- Place のリストを受け取り、スコアリングを行う
- ScoredPlace のリストをスコア降順で返す

配置: `apps/api/src/recommendation/service.ts`

### Scorer（スコアラー）

実際のスコアリングアルゴリズムを実装する。

責務:
- 距離・評価・営業状況に基づく重みづけスコア計算
- 重み係数は設定値として外出しする

配置: `apps/api/src/recommendation/scorer.ts`

将来 AI 推薦を導入する場合、同じインターフェースを満たす `ai-scorer.ts` を追加し、RecommendationService 内で切り替える。

### PlacesApiClient

Google Places API との通信を担当する。

責務:
- Places API への HTTP リクエスト
- API レスポンスの変換
- API キーの管理

配置: `apps/api/src/places/client.ts`

## モジュール間の依存関係

```
places/route.ts
  → places/service.ts
    → places/client.ts（外部 API）
    → recommendation/service.ts（スコアリング依頼）
      → recommendation/scorer.ts
```

- `recommendation` モジュールは `places` モジュールに依存しない（Place データを引数として受け取るだけ）
- `places` モジュールが `recommendation` モジュールを呼び出す方向の依存のみ許可する
- 循環依存は禁止

## フロントエンド側のドメイン表現

- フロントエンドでは Orval が生成した型定義をそのまま利用する
- フロントエンド独自のドメインモデルは定義しない（バックエンドの型が Single Source of Truth）
- 表示用の変換が必要な場合は、`entities/` レイヤー内のユーティリティ関数で行う
