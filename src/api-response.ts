import type { ApiContent } from './api-content.js'
import type { ConstructorFromJson, JsonType } from './json-utils.js'

type ApiMetaResponse = {
  total: number
  limit: number
  offset: number
}

/**
 * raw list API response
 */
export type ListApiResponseInJson<ApiSchema extends ApiContent> = {
  meta: ApiMetaResponse
  data: JsonType<ApiSchema>[]
}

/**
 * typed list API response
 */
export class ListApiResponse<ApiSchema extends ApiContent> {
  readonly meta: ApiMetaResponse
  readonly data: ApiSchema[]

  constructor(json: ListApiResponseInJson<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) {
    this.meta = json.meta
    this.data = json.data.map((content) => new Constructor(content))
  }
}
