import { JsonValueConverter, JsonType } from './json-utils'

/**
 * コンテンツの基底クラス
 */
export abstract class ApiContent {
  /** コンテンツ ID */
  id: string

  /** 作成日時 */
  createdAt: Date

  /** 更新日時 */
  updatedAt: Date

  /** 公開日時 */
  publishedAt: Date | null

  /** 停止日時 */
  closedAt: Date | null

  /**
   * @param json コンテンツの JSON オブジェクト
   */
  constructor(json: JsonType<ApiContent>) {
    this.id = json.id
    this.createdAt = JsonValueConverter.toDate(json.createdAt)
    this.updatedAt = JsonValueConverter.toDate(json.createdAt)
    this.publishedAt = JsonValueConverter.toNullableDate(json.publishedAt)
    this.closedAt = JsonValueConverter.toNullableDate(json.closedAt)
  }

  // to avoid a warning "Cannot stringify arbitrary non-POJOs"
  toJSON() {
    return { ...this }
  }
}
