import type { ReactNode } from "react";
import type { Api } from "./make-grid-enterprise";
import type { FloatingFrame as FF, PanelFrame } from "./types-enterprise";
import type { CellRendererParams, ColumnHeaderRendererParams, RowDetailParams } from "./types";
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
