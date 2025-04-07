import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export type FloatingCellRendererParams<A, C> = {
  column: C;
  api: A;
};
export type FloatingCellRenderer<A, C, E> = (p: FloatingCellRendererParams<A, C>) => E;
export type FloatingCellRenderers<A, C, E> = {
  [id: string]: FloatingCellRenderer<A, C, E>;
};

// Additional
export type FloatingCellRendererParamsCore<D, E> = FloatingCellRendererParams<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;

export type FloatingCellRendererCore<D, E> = FloatingCellRenderer<
  ApiCore<D, E>,
  ColumnCore<D, E>,
  E
>;
export type FloatingCellRenderersCore<D, E> = FloatingCellRenderers<
  ApiCore<D, E>,
  ColumnCore<D, E>,
  E
>;

export type FloatingCellRendererParamsPro<D, E> = FloatingCellRendererParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type FloatingCellRendererPro<D, E> = FloatingCellRenderer<ApiPro<D, E>, ColumnPro<D, E>, E>;
export type FloatingCellRenderersPro<D, E> = FloatingCellRenderers<
  ApiPro<D, E>,
  ColumnPro<D, E>,
  E
>;
