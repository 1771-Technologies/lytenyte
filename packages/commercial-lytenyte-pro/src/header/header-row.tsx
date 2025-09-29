import { HeaderRow as Core } from "@1771technologies/lytenyte-core/yinternal";
import type { JSX, ReactNode } from "react";

export interface HeaderRowProps {
  readonly headerRowIndex: number;
}

export const HeaderRow = Core as (
  props: JSX.IntrinsicElements["div"] & HeaderRowProps,
) => ReactNode;
