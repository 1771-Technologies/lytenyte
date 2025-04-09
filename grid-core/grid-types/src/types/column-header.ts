import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export type ColumnHeaderHeightProperty = number;

export type ColumnHeaderRendererParams<A, C> = {
  readonly column: C;
  readonly api: A;
};
export type ColumnHeaderRenderer<A, C, E> = (p: ColumnHeaderRendererParams<A, C>) => E;
export type ColumnHeaderRenderers<A, C, E> = {
  readonly [id: string]: ColumnHeaderRenderer<A, C, E>;
};

export type ColumnGroupHeaderRendererParams<A> = {
  readonly api: A;
};
export type ColumnGroupHeaderRenderer<A, E> = (p: ColumnGroupHeaderRendererParams<A>) => E;

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

export type ColumnGroupHeaderRendererParamsCore<D, E> = ColumnGroupHeaderRendererParams<
  ApiCore<D, E>
>;
export type ColumnGroupHeaderRendererCore<D, E> = ColumnGroupHeaderRenderer<ApiCore<D, E>, E>;

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

export type ColumnGroupHeaderRendererParamsPro<D, E> = ColumnGroupHeaderRendererParams<
  ApiPro<D, E>
>;
export type ColumnGroupHeaderRendererPro<D, E> = ColumnGroupHeaderRenderer<ApiPro<D, E>, E>;
