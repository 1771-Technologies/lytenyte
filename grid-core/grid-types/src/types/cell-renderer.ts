import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type CellRendererParams<A, D, C> = {
  column: C;
  columnIndex: number;
  api: A;
  row: RowNode<D>;
};

export type CellRenderer<A, D, C, E> = (params: CellRendererParams<A, D, C>) => E;
export type CellRenderers<A, D, C, E> = {
  [id: string]: CellRenderer<A, D, C, E>;
};

export type CellRendererParamsCore<D, E> = CellRendererParams<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type CellRendererCore<D, E> = CellRenderer<ApiCore<D, E>, D, ColumnCore<D, E>, E>;
export type CellRenderersCore<D, E> = CellRenderers<ApiCore<D, E>, D, ColumnCore<D, E>, E>;

export type CellRendererParamsPro<D, E> = CellRendererParams<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellRendererPro<D, E> = CellRenderer<ApiPro<D, E>, D, ColumnPro<D, E>, E>;
export type CellRenderersPro<D, E> = CellRenderers<ApiPro<D, E>, D, ColumnPro<D, E>, E>;
