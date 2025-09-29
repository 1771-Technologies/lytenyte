import { type CSSProperties, type JSX, type ReactNode } from "react";
import type { HeaderCellFloating, HeaderCellLayout } from "../+types";
import { type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { HeaderCell as HeaderCellCore } from "@1771technologies/lytenyte-core/yinternal";
export interface HeaderCellProps<T> {
  readonly cell: HeaderCellLayout<T> | HeaderCellFloating<T>;
  readonly resizerAs?: SlotComponent;
  readonly resizerClassName?: string;
  readonly resizerStyle?: CSSProperties;
}

export const HeaderCell = HeaderCellCore as (
  props: JSX.IntrinsicElements["div"] & HeaderCellProps<any>,
) => ReactNode;
