import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export type ColumnHeaderHeightProperty = number;

export type ColumnHeaderRendererParams<A, C> = {
  column: C;
  api: A;
};
export type ColumnHeaderRenderer<A, C, E> = (p: ColumnHeaderRendererParams<A, C>) => E;
export type ColumnHeaderRenderers<A, C, E> = {
  [id: string]: ColumnHeaderRenderer<A, C, E>;
};

// Simplified
export type ColumnHeaderHeightPropertyCore = ColumnHeaderHeightProperty;
export type ColumnHeaderRendererParamsCore<D, E> = ColumnHeaderRendererParams<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;
export type ColumnHeaderRendererCore<D, E> = ColumnHeaderRenderer<
  ApiCore<D, E>,
  ColumnCore<D, E>,
  E
>;
export type ColumnHeaderRenderersCore<D, E> = ColumnHeaderRenderers<
  ApiCore<D, E>,
  ColumnCore<D, E>,
  E
>;

export type ColumnHeaderHeightPropertyPro = ColumnHeaderHeightProperty;
export type ColumnHeaderRendererParamsPro<D, E> = ColumnHeaderRendererParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ColumnHeaderRendererPro<D, E> = ColumnHeaderRenderer<ApiPro<D, E>, ColumnPro<D, E>, E>;
export type ColumnHeaderRenderersPro<D, E> = ColumnHeaderRenderers<
  ApiPro<D, E>,
  ColumnPro<D, E>,
  E
>;
