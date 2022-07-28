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
 * converts a JSON string that represents Date into Date object
 * @param value a string, which can be parsed with Date.parse
 * @returns a Date object that the string represents
 */
export const toDate = (value: string) => new Date(value)

/**
 * converts a JSON string that represents Date or null value into Date object or null, respectively
 * @param value a string, which can be parsed as Date, or null
 * @returns a Date object that the string represents unless the value is null, otherwise null
 */
export const toNullableDate = (value: string | null) => (value != null ? new Date(value) : null)
