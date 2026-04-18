# @place-finder/api-client

OpenAPI から自動生成される API クライアントの格納先。

## 想定フロー

1. `apps/api` で Elysia + Swagger により OpenAPI スキーマを公開 (`/swagger/json`)
2. Orval 等のコード生成ツールで `generated/` 配下にクライアントコードを生成
3. `apps/web` から `@place-finder/api-client` として import して利用

## 次のステップ

```bash
bun add -d orval  # ルートまたはこのパッケージに追加
```

`orval.config.ts` を作成し、API の URL とアウトプット先を設定する。
