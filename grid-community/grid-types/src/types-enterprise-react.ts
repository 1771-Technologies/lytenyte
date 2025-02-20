import type { ReactNode } from "react";
import type { Api } from "./make-grid-enterprise";
import type {
  ColumnFilter,
  ColumnFilterModel,
  FloatingFrame as FF,
  PanelFrame,
} from "./types-enterprise";
import type {
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
