# hacoCMS JavaScript/TypeScript SDK

[![build, test, lint](https://github.com/hacocms/hacocms-js-sdk/actions/workflows/test.yml/badge.svg)](https://github.com/hacocms/hacocms-js-sdk/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/hacocms-js-sdk.svg)](https://badge.fury.io/js/hacocms-js-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[hacoCMS](https://hacocms.com/) の JavaScript/TypeScript 用 API クライアントライブラリです。

## インストール

```sh
npm install hacocms-js-sdk

# or

yarn add hacocms-js-sdk
```

## 使い方

```js
const {
  HacoCmsClient, // API クライアント
  ApiContent, // API スキーマの基底クラス
  SortQuery, // ソートクエリビルダ
} = require('hacocms-js-sdk')

const client = new HacoCmsClient(
  'https://{アカウント識別子}-{サブドメイン}.hacocms.com', // API にアクセスする URL
  'ACCESS_TOKEN', // プロジェクトの Access-Token
  'PROJECT_DRAFT_TOKEN' // オプション：プロジェクトの Project-Draft-Token
)

// API スキーマの定義（例）
class ExampleContent extends ApiContent {
  // API レスポンスの JSON からコンテンツオブジェクトを生成するコンストラクタ
  constructor(json) {
    super(json) // API 共通のフィールド（id, createdAt など）が初期化されます。

    this.title = json.title
    this.body = json.body
  }
}

// コンテンツ一覧を取得
const res = client.getList(ExampleContent, '/example', {
  s: SortQuery.build(['createdAt', 'desc']), // 作成日時の降順
})
for (const content of res.data) {
  console.log(content.title)
}

// 特定のコンテンツを取得
const contentId = 'CONTENT_ID' // コンテンツ ID
const content = client.getContent(ExampleContent, '/example', contentId)
console.log(content.title)

// シングル形式の API コンテンツを取得
const single = client.getSingle(ExampleContent, '/single')
console.log(single.title)

// 下書きを含めたコンテンツ一覧を取得
// ※ HacoCmsClient のコンストラクタに Project-Draft-Token を渡しておく必要があります。
const all = client.getListIncludingDraft(ExampleContent, '/example', {
  s: SortQuery.build('-updatedAt'), // 更新日時の降順
})
for (const content of all.data) {
  console.log(content.title)
}

// 下書きのコンテンツを取得
const draftToken = 'DRAFT_TOKEN' // 取得するコンテンツの Draft-Token
const draft = client.getContent(ExampleContent, '/example', contentId, draftToken)
console.log(draft.title)
```

## ライセンス

MIT License
