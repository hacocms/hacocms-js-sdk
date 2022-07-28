import { SortQuery } from './query'

describe('sort', () => {
  test.each([
    [[], ''],
    [['createdAt'], 'createdAt'],
    [[['updatedAt', 'desc'] as const], '-updatedAt'],
    [[['publishedAt', 'desc'] as const, 'id'], '-publishedAt,id'],
  ])('%p', (args, want) => {
    expect(SortQuery.create(...args).toString()).toBe(want)
  })
})
