import { type JSX, type ReactNode } from "react";
import type { RowFullWidthRowLayout } from "../+types";
import {
  RowFullWidth as RowFullWidthCore,
  type DropWrapProps,
} from "@1771technologies/lytenyte-core/yinternal";

export interface RowFullWidthProps extends Omit<DropWrapProps, "accepted"> {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
  readonly accepted?: string[];
}

export const RowFullWidth = RowFullWidthCore as (
  props: JSX.IntrinsicElements["div"] & RowFullWidthProps,
) => ReactNode;
