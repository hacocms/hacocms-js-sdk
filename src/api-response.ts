import { ApiContent } from './api-content'
import { ConstructorFromJson, JsonType } from './json-utils'

type ApiMetaResponse = {
  total: number
  limit: number
  offset: number
}

/**
 * raw API response
 */
export type ApiResponseInJson<ApiSchema extends ApiContent> = {
  meta: ApiMetaResponse
  data: JsonType<ApiSchema>[]
}

const from = <ApiSchema extends ApiContent>(json: JsonType<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) => new Constructor(json)

/**
 * typed API response
 */
export class ApiResponse<ApiSchema extends ApiContent> {
  readonly meta: ApiMetaResponse
  readonly data: ApiSchema[]

  constructor(json: ApiResponseInJson<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) {
    this.meta = json.meta
    this.data = json.data.map((content) => from(content, Constructor))
  }
}
