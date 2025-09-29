import { type JSX, type ReactNode } from "react";
import type { HeaderGroupCellLayout } from "../+types";
import { HeaderGroupCell as Core } from "@1771technologies/lytenyte-core/yinternal";

export interface HeaderGroupCellProps {
  readonly cell: HeaderGroupCellLayout;
}

export const HeaderGroupCell = Core as (
  props: JSX.IntrinsicElements["div"] & HeaderGroupCellProps,
) => ReactNode;
