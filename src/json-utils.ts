type ExcludePseudoFields<O extends object> = { [K in keyof O]: K extends `$${string}` ? never : O[K] }
type ExcludeFunction<O extends object> = { [K in keyof O]: O[K] extends Function ? never : K }[keyof O]

type ExcludeFields<O extends object> = ExcludeFunction<ExcludePseudoFields<O>>

/**
 * a representable type in JSON which Date fields are replaced with string ones, the function fields are removed and pseudo fields that start with '$' are also removed
 */
export type JsonType<V> =
  | (V extends string | number | boolean ? V : V extends Date ? string : V extends Array<infer U> ? JsonType<U>[] : V extends object ? { [K in ExcludeFields<V>]: JsonType<V[K]> } : never)
  | (V extends null ? null : never)

/**
 * a type that has a constructor from JSON object
 */
export type ConstructorFromJson<Typed extends object> = { new (json: JsonType<Typed>): Typed }

/**
 * 日付文字列を Date オブジェクトに変換します。
 *
 * @param value 日付文字列（`new Date(...)` でパースできる形式）
 * @returns Date オブジェクト
 */
export const toDate = (value: string) => new Date(value)

/**
 * nullable な日付文字列を、日付文字列なら Date オブジェクトに変換し、 `null` なら `null` を返します。
 * @param value 日付文字列（`new Date(...)` でパースできる形式）または `null`
 * @returns Date オブジェクトまたは `null`
 */
export const toNullableDate = (value: string | null) => (value != null ? new Date(value) : null)
