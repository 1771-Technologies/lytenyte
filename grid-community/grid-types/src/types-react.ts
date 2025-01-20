import type { ReactNode } from "react";
import type { Api } from "./make-grid-community";
import type { CellRendererParams, ColumnHeaderRendererParams, RowDetailParams } from "./types";
import type { ColumnCommunityReact } from "./make-grid-react";

export type CellRendererParamsReact<D> = CellRendererParams<
  Api<D, ReactNode>,
  D,
  ColumnCommunityReact<D>
>;

export type ColumnHeaderRendererParamsReact<D> = ColumnHeaderRendererParams<
  Api<D, ReactNode>,
  ColumnCommunityReact<D>
>;
export type RowDetailParamsReact<D> = RowDetailParams<Api<D, ReactNode>, D>;
