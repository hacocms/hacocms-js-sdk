import { JsonValueConverter, JsonType } from './json-utils'

/**
 * common fields of API contents
 */
export abstract class ApiContent {
  readonly $tag: string = ''

  id: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  closedAt: Date | null

  /**
   * constructs an API content object from JSON
   * @param json JSON of an API content
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
