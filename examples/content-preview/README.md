# コンテンツプレビュー機能に対応した Web サーバの実装例

[hacoCMS](https://hacocms.com) の[コンテンツプレビュー](https://hacocms.com/docs/entry/api-preview)機能に対応した Web サーバの実装例です。

## 使い方

### 環境変数にプロジェクトのサブドメインとアクセストークンを設定

`.env` ファイルを作成し、 `HACOCMS_PROJECT_SUBDOMAIN` にプロジェクトのサブドメインを、`HACOCMS_PROJECT_ACCESS_TOKEN` にプロジェクトの Access-Token を設定してください。

### API の準備

本サンプルでは、以下の設定のフィールドを持つ `entries` API を対象とします。

| #   | フィールドタイプ   | フィールド名（任意） | フィールド ID |
| --- | ------------------ | -------------------- | ------------- |
| 1   | テキストフィールド | タイトル             | `title`       |
| 2   | テキストフィールド | 概要                 | `description` |
| 3   | リッチテキスト     | 本文                 | `body`        |

### サンプルサーバの起動

```console
$ npm install
$ npm run start

> hacocms-content-preview-sample@1.0.0 start
> node index.js

http://localhost:3000/{CONTENT_ID}?draft={DRAFT_TOKEN}
```

### リクエスト例

例えば、コンテンツ ID が `abcdef` で Draft-Token が `HogefugaPiyo` である場合、
`http://localhost:3000/abcdef?draft=HogefugaPiyo` にアクセスすることで当該コンテンツのプレビューを表示することができます。
