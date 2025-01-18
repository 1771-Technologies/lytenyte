import type { ReactNode } from "react";
import type { Api } from "./make-grid-community";
import type { CellRendererParams } from "./types";
import type { ColumnCommunityReact } from "./make-grid-react";

export type CellRendererParamsReact<D> = CellRendererParams<
  Api<D, ReactNode>,
  D,
  ColumnCommunityReact<D>
>;
