import { ApiContent, type JsonType } from 'hacocms-js-sdk'

/**
 * 記事（entries）APIのコンテンツ
 */
export class Entry extends ApiContent {
  // APIスキーマに設定したフィールドを定義します。

  /** タイトル */
  title: string

  /** 本文 */
  body: string

  constructor(json: JsonType<Entry>) {
    super(json)

    this.title = json.title
    this.body = json.body
  }
}
