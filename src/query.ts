/**
 * ソートクエリ
 */
export class SortQuery {
  #orders: readonly (string | readonly [string, 'desc'])[]

  private constructor(orders: (string | readonly [string, 'desc'])[]) {
    this.#orders = orders
  }

  /**
   * ソートクエリ文字列を組み立てます。
   *
   * @param orders コンテンツの比較に使用するフィールドの配列（昇順のフィールドはフィールド名、降順のフィールドは `[フィールド名, 'desc']` または `-フィールド名` とします）
   * @returns ソートクエリ文字列
   */
  static build(...orders: (string | readonly [string, 'desc'])[]) {
    return new SortQuery(orders).toString()
  }

  /**
   * ソートクエリオブジェクトを生成します。
   *
   * @param orders コンテンツの比較に使用するフィールドの配列（昇順のフィールドはフィールド名、降順のフィールドは `[フィールド名, 'desc']` または `-フィールド名` とします）
   * @returns ソートクエリオブジェクト
   */
  static create(...orders: (string | readonly [string, 'desc'])[]) {
    return new SortQuery(orders)
  }

  toString() {
    return this.#orders.map((order) => (order instanceof Array ? `-${order[0]}` : order)).join(',')
  }
}

/**
 * クエリパラメータ
 */
export type QueryParameters = {
  /** 検索文字列 */
  search: string

  /** 検索フィルタークエリ */
  q: string

  /** 取得件数 */
  limit: number

  /** 取得開始位置 */
  offset: number

  /** ソートクエリ */
  s: string

  /** ステータス */
  status: number
}
