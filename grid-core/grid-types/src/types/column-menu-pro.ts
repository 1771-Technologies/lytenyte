import type { ApiPro, ColumnPro } from "../export-pro";

export type ColumnMenuRendererParams<A, C> = {
  api: A;
  column: C;
};
export type ColumnMenuRenderer<A, C, E> = (p: ColumnMenuRendererParams<A, C>) => E;

// Additional

export type ColumnMenuRendererParamsPro<D, E> = ColumnMenuRendererParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ColumnMenuRendererPro<D, E> = ColumnMenuRenderer<ApiPro<D, E>, ColumnPro<D, E>, E>;
