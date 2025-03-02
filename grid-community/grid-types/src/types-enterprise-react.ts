import type { ReactNode } from "react";
import type { Api } from "./make-grid-enterprise";
import type {
  ColumnFilter,
  ColumnFilterModel,
  ColumnMenuRenderer,
  ColumnMenuRendererParams,
  ContextMenuRenderer,
  ContextMenuRendererParams,
  FloatingFrame as FF,
  PanelFrame,
} from "./types-enterprise";
import type {
  AutosizeCellParameters,
  AutosizeHeaderParameters,
  CellRendererParams,
  ColumnHeaderRendererParams,
  FloatingCellRendererParams,
  RowDetailParams,
} from "./types";
import type { ColumnEnterpriseReact } from "./make-grid-react";

export type FloatingFrameReact<D> = FF<Api<D, ReactNode>, ReactNode>;
export type PanelFrameReact<D> = PanelFrame<Api<D, ReactNode>, ReactNode>;

export type CellRendererParamsReact<D> = CellRendererParams<
  Api<D, ReactNode>,
  D,
  ColumnEnterpriseReact<D>
>;

export type ColumnHeaderRendererParamsReact<D> = ColumnHeaderRendererParams<
  Api<D, ReactNode>,
  ColumnEnterpriseReact<D>
>;

export type RowDetailParamsReact<D> = RowDetailParams<Api<D, ReactNode>, D>;

export type FloatingCellRendererParamsReact<D> = FloatingCellRendererParams<
  Api<D, ReactNode>,
  ColumnEnterpriseReact<D>
>;

export type ColumnFilterReact<D> = ColumnFilter<Api<D, ReactNode>, D>;
export type ColumnFilterModelReact<D> = ColumnFilterModel<Api<D, ReactNode>, D>;

export type ContextMenuRendererParamsReact<D> = ContextMenuRendererParams<Api<D, ReactNode>>;
export type ContextMenuRendererReact<D> = ContextMenuRenderer<Api<D, ReactNode>, ReactNode>;

export type ColumnMenuRendererReact<D> = ColumnMenuRenderer<
  Api<D, ReactNode>,
  ColumnEnterpriseReact<D>,
  ReactNode
>;
export type ColumnMenuRendererParamsReact<D> = ColumnMenuRendererParams<
  Api<D, ReactNode>,
  ColumnEnterpriseReact<D>
>;

export type AutosizeHeaderParamsReact<D> = AutosizeHeaderParameters<Api<D, ReactNode>, ReactNode>;
export type AutosizeCellParamsReact<D> = AutosizeCellParameters<Api<D, ReactNode>, D, ReactNode>;
