export type FirstLetter<S extends string> = S extends `${infer F}${infer _}`
  ? F
  : S

export type Invert<T> = { [V in T[keyof T] & PropertyKey]: keyof T }
