import { type JSX, type ReactNode } from "react";
import type { RowNormalRowLayout } from "../+types";
import { Row as RowCore, type DropWrapProps } from "@1771technologies/lytenyte-core/yinternal";

export interface RowProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowNormalRowLayout<any>;
  readonly accepted?: string[];
}

export const Row = RowCore as (props: Omit<JSX.IntrinsicElements["div"], "onDrag"> & RowProps) => ReactNode;
