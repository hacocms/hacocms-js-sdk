import { ApiContent } from './api-content'
import { ConstructorFromJson, JsonType } from './json-utils'

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

const from = <ApiSchema extends ApiContent>(json: JsonType<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) => new Constructor(json)

/**
 * typed list API response
 */
export class ListApiResponse<ApiSchema extends ApiContent> {
  readonly meta: ApiMetaResponse
  readonly data: ApiSchema[]

  constructor(json: ListApiResponseInJson<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) {
    this.meta = json.meta
    this.data = json.data.map((content) => from(content, Constructor))
  }
}

/**
 * typed single API response
 */
export class SingleApiResponse<ApiSchema extends ApiContent> {
  readonly data: ApiSchema

  constructor(json: JsonType<ApiSchema>, Constructor: ConstructorFromJson<ApiSchema>) {
    this.data = from(json, Constructor)
  }
}
