import { type JSX, type ReactNode } from "react";
import type { RowCellLayout } from "../+types";
import { Cell as CellCore } from "@1771technologies/lytenyte-core/yinternal";

export interface CellProps {
  readonly cell: RowCellLayout<any>;
}
export const Cell = CellCore as (
  props: Omit<JSX.IntrinsicElements["div"], "children"> & CellProps,
) => ReactNode;
