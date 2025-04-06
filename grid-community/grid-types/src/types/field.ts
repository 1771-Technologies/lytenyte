export type FieldTypePath = 1;

export type Field<A, D, C> =
  | string
  | number
  | { kind: FieldTypePath; path: string }
  | ((data: D, column: C, api: A) => unknown);
