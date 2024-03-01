import { JsonType, toDate, toNullableDate } from './json-utils.js'

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
   * @param json コンテンツ JSON
   */
  constructor(json: JsonType<ApiContent>) {
    this.id = json.id
    this.createdAt = toDate(json.createdAt)
    this.updatedAt = toDate(json.updatedAt)
    this.publishedAt = toNullableDate(json.publishedAt)
    this.closedAt = toNullableDate(json.closedAt)
  }

  // to avoid a warning "Cannot stringify arbitrary non-POJOs"
  toJSON() {
    return { ...this }
  }
}
