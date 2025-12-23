import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { ReactNode } from "react";
import type { API, DataRect } from "./api";

export interface GridSpec<
  Data = unknown,
  ColExt extends Record<string, any> = object,
  S extends RowSource<Data> = RowSource,
  Ext extends Record<string, any> = object,
> {
  readonly data?: Data;
  readonly columnExtension?: ColExt;
  readonly source?: S;
  readonly apiExtension?: Ext;
}

export interface DialogFrame<Spec extends GridSpec = GridSpec> {
  readonly component: (props: DialogFrameProps<Spec>) => ReactNode;
}
export interface DialogFrameProps<Spec extends GridSpec> {
  readonly api: API<Spec>;
  readonly context?: unknown;
  readonly frame: DialogFrame<Spec>;
}

export interface PopoverFrame<Spec extends GridSpec = GridSpec> {
  readonly component: (props: PopoverFrameProps<Spec>) => ReactNode;
}

export interface PopoverFrameProps<Spec extends GridSpec = GridSpec> {
  readonly api: API<Spec>;
  readonly context?: unknown;
  readonly frame: PopoverFrame<Spec>;
  readonly target: HTMLElement | VirtualTarget;
}

export interface VirtualTarget {
  readonly getBoundingClientRect: () => Omit<DOMRect, "toJSON">;
  readonly getClientRects?: () => Omit<DOMRect, "toJSON">[];
  readonly contextElement?: HTMLElement;
}

export interface DataRectSplit extends DataRect {
  readonly isUnit: boolean;

  readonly borderTop?: boolean;
  readonly borderBottom?: boolean;
  readonly borderStart?: boolean;
  readonly borderEnd?: boolean;
}
