export class SortQuery {
  #orders: readonly (string | readonly [string, 'desc'])[]

  private constructor(orders: (string | readonly [string, 'desc'])[]) {
    this.#orders = orders
  }

  /**
   *
   * @param orders keys using to sort contents in order by, which ascending keys are putting themselves and descending ones are replacing with [key, 'desc']
   * @returns a SortQuery object
   */
  static create(...orders: (string | readonly [string, 'desc'])[]) {
    return new SortQuery(orders)
  }

  toString() {
    return this.#orders.map((order) => (order instanceof Array ? `-${order[0]}` : order)).join(',')
  }
}

export type QueryParameters = {
  search: string

  limit: number
  offset: number

  /**
   * filter query
   */
  q: string

  /**
   * sort query
   */
  s: SortQuery

  status: number
}
