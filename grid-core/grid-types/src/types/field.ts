import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export type FieldTypePath = 1;

export type Field<A, D, C> =
  | string
  | number
  | { kind: FieldTypePath; path: string }
  | ((data: D, column: C, api: A) => unknown);

export type FieldTypePathCore = FieldTypePath;
export type FieldCore<D, E> = Field<ApiCore<D, E>, D, ColumnCore<D, E>>;

export type FieldTypePathPro = FieldTypePath;
export type FieldPro<D, E> = Field<ApiPro<D, E>, D, ColumnPro<D, E>>;
