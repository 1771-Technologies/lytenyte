import type { ApiPro, ColumnPro } from "../export-pro";

export interface ColumnPivotEventParams<A, C> {
  readonly api: A;
  readonly columns?: C[];
  readonly error?: unknown;
}
export type ColumnPivotEvent<A, C> = (p: ColumnPivotEventParams<A, C>) => void;

// Additional
export type ColumnPivotEventParamsPro<D, E> = ColumnPivotEventParams<ApiPro<D, E>, ColumnPro<D, E>>;
export type ColumnPivotEventPro<D, E> = ColumnPivotEvent<ApiPro<D, E>, ColumnPro<D, E>>;
