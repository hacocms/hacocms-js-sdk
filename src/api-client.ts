import axios from 'axios'
import { ApiContent } from './api-content'
import { ConstructorFromJson } from './json-utils'
import { ListApiResponse, ApiResponseInJson } from './api-response'
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
   * リスト形式の API に GET リクエストを送信します。
   * {@link https://hacocms.com/references/content-api#tag/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84/paths/~1api~1v1~1%7Bendpoint%7D/get}
   *
   * @param Constructor レスポンスの JSON オブジェクトを引数とするコンストラクタを持つクラスオブジェクト
   * @param endpoint API のエンドポイント
   * @param query クエリパラメータ
   * @returns コンテンツの一覧
   */
  protected async getList<ApiSchema extends ApiContent>(Constructor: ConstructorFromJson<ApiSchema>, endpoint: string, query: Partial<QueryParameters> = {}) {
    const res = await this.axios.get<ApiResponseInJson<ApiSchema>>(endpoint, {
      params: Object.fromEntries(Object.entries(query).map(([k, v]) => [k, v.toString()])),
    })
    try {
      return new ListApiResponse(res.data, Constructor)
    } catch (error) {
      throw new Error(`failed to construct an API response object from JSON: ${JSON.stringify(res.data)}`)
    }
  }
}
