import axios from 'axios'
import { ApiContent } from './api-content'
import { ConstructorFromJson, JsonType } from './json-utils'
import { ListApiResponse, ListApiResponseInJson, SingleApiResponse } from './api-response'
import { QueryParameters } from './query'

/**
 * hacoCMS の API クライアント
 */
export class HacoCmsClient {
  private readonly axios

  /**
   * @param baseURL API のベース URL `https://{アカウント識別子}-{サブドメイン}.hacocms.com/`
   * @param accessToken プロジェクトの Access-Token
   */
  constructor(baseURL: string, accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    this.axios = axios.create({
      baseURL: new URL('/api/v1/', baseURL).toString(),
      headers,
    })
  }

  /**
   * コンテンツの一覧を取得します。
   * {@link https://hacocms.com/references/content-api#tag/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84/paths/~1api~1v1~1%7Bendpoint%7D/get}
   *
   * @param Constructor コンテンツの JSON オブジェクトを引数とするコンストラクタを持つクラスオブジェクト
   * @param endpoint リスト形式 API のエンドポイント
   * @param query クエリパラメータ
   * @returns API のレスポンスボディ
   */
  protected async getList<ApiSchema extends ApiContent>(Constructor: ConstructorFromJson<ApiSchema>, endpoint: string, query: Partial<QueryParameters> = {}) {
    const res = await this.axios.get<ListApiResponseInJson<ApiSchema>>(endpoint, {
      params: query,
    })
    try {
      return new ListApiResponse(res.data, Constructor)
    } catch (error) {
      throw new Error(`failed to construct an API response object from JSON: ${JSON.stringify(res.data)}`)
    }
  }

  /**
   * シングル形式 API のコンテンツを取得します。
   * {@link https://hacocms.com/references/content-api#tag/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84/paths/~1api~1v1~1%7Bendpoint%7D/get}
   *
   * @param Constructor コンテンツの JSON オブジェクトを引数とするコンストラクタを持つクラスオブジェクト
   * @param endpoint シングル形式 API のエンドポイント
   * @returns コンテンツのオブジェクト（`Constructor` 型）
   */
  protected async getSingle<ApiSchema extends ApiContent>(Constructor: ConstructorFromJson<ApiSchema>, endpoint: string) {
    const res = await this.axios.get<JsonType<ApiSchema>>(endpoint)
    try {
      return new SingleApiResponse(res.data, Constructor)
    } catch (error) {
      throw new Error(`failed to construct an API response object from JSON: ${JSON.stringify(res.data)}`)
    }
  }

  /**
   * 指定したコンテンツを取得します。
   * {@link https://hacocms.com/references/content-api#tag/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84/paths/~1api~1v1~1%7Bendpoint%7D~1%7Bcontent_id%7D/get}
   *
   * @param Constructor コンテンツの JSON オブジェクトを引数とするコンストラクタを持つクラスオブジェクト
   * @param endpoint リスト形式 API のエンドポイント
   * @param id コンテンツ ID
   * @returns コンテンツのオブジェクト（`Constructor` 型）
   */
  protected async getContent<ApiSchema extends ApiContent>(Constructor: ConstructorFromJson<ApiSchema>, endpoint: string, id: string) {
    const res = await this.axios.get<JsonType<ApiSchema>>(`${endpoint}/${id}`)
    try {
      return new SingleApiResponse(res.data, Constructor)
    } catch (error) {
      throw new Error(`failed to construct an API response object from JSON: ${JSON.stringify(res.data)}`)
    }
  }
}
