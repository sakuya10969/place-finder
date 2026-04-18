# API デザイン — place-finder

## 設計方針

- バックエンドファースト: API は必ずバックエンドの TypeBox スキーマ定義を起点に設計する
- OpenAPI 駆動: Elysia + TypeBox から OpenAPI スキーマを自動生成し、Orval でクライアントを生成する
- RESTful: リソース指向の URL 設計を採用する
- 初期段階では認証不要

## ベース URL

- 開発環境: `http://localhost:3000`
- フロントエンドからのアクセス: `/api`（Vite proxy 経由）

## エンドポイント一覧

### ヘルスチェック

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/health` | サーバーの稼働状態を確認 |

レスポンス:
```json
{
  "status": "ok",
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

### 店舗検索

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/places/search` | 現在地周辺の店舗を検索 |

クエリパラメータ:

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| lat | number | ○ | 緯度 |
| lng | number | ○ | 経度 |
| radius | number | - | 検索半径（メートル）。デフォルト: 1000 |
| type | string | - | ジャンルフィルタ（restaurant, cafe 等） |

レスポンス:
```json
{
  "places": [
    {
      "id": "ChIJ...",
      "name": "店舗名",
      "types": ["restaurant"],
      "location": { "lat": 35.6812, "lng": 139.7671 },
      "rating": 4.2,
      "isOpen": true,
      "distance": 350,
      "score": 0.85
    }
  ]
}
```

### 店舗詳細（将来候補）

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/places/:id` | 特定の店舗の詳細情報を取得 |

※ MVP では検索結果に含まれる基本情報で十分。詳細ページが必要になった段階で追加する。

## エラーレスポンス

共通のエラーレスポンス形式:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "lat is required"
  }
}
```

| HTTP ステータス | コード | 説明 |
|---|---|---|
| 400 | VALIDATION_ERROR | リクエストパラメータの不正 |
| 500 | INTERNAL_ERROR | サーバー内部エラー |
| 502 | EXTERNAL_API_ERROR | 外部 API（Places API）のエラー |

## OpenAPI スキーマ

- Elysia の Swagger プラグインにより `/swagger` でドキュメントを閲覧可能
- `/swagger/json` で OpenAPI JSON スキーマを取得可能
- このスキーマを Orval の入力として使用する

## API 設計ルール

1. すべてのエンドポイントは TypeBox でリクエスト/レスポンスのスキーマを定義する
2. スキーマは各モジュールの `schema.ts` に配置する
3. レスポンスの型は明示的に定義し、OpenAPI ドキュメントに正確に反映させる
4. エラーレスポンスも TypeBox で型定義する
5. API の追加・変更後は `bun run generate` でクライアントを再生成する
