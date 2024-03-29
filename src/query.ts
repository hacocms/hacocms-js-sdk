/**
 * ソートクエリ
 */
// biome-ignore lint/complexity/noStaticOnlyClass: backward-compatibility
export class SortQuery {
  /**
   * ソートクエリ文字列を組み立てます。
   *
   * @param orders コンテンツの比較に使用するフィールド。比較する順に、昇順の場合はフィールド名、降順の場合は `[フィールド名, 'desc']` または `'-フィールド名'` を並べます。
   * @returns ソートクエリ文字列
   */
  static build(...orders: (string | readonly [string, 'desc'])[]) {
    return orders.map((order) => (Array.isArray(order) ? `-${order[0]}` : order)).join(',')
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
