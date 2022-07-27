import axios from 'axios'
import ApiContent from './api-content'
import { ConstructorFromJson } from './json-utils'
import { ApiResponse, ApiResponseInJson } from './api-response'
import { QueryParameters, paramsSerializer } from './query-builder'

/**
 * HacoCMS API client
 */
export default class HacoCmsClient {
  private readonly axios

  /**
   * creates a HacoCMS API client
   * @param baseURL
   * @param accessToken
   */
  constructor(baseURL: string, accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    this.axios = axios.create({
      baseURL,
      headers,
    })
  }

  /**
   * sends a GET request to a specified path
   * @param Constructor a object with the API content constructor
   * @param path the API path
   * @param params query parameters
   * @returns response body from the API
   */
  protected async get<ApiSchema extends ApiContent>(Constructor: ConstructorFromJson<ApiSchema>, path: string, params: Partial<QueryParameters> = {}) {
    const res = await this.axios.get<ApiResponseInJson<ApiSchema>>(path, { params, paramsSerializer })
    try {
      return new ApiResponse(res.data, Constructor)
    } catch (error) {
      throw new Error(`failed to construct an API response object from JSON: ${JSON.stringify(res.data)}`)
    }
  }
}
