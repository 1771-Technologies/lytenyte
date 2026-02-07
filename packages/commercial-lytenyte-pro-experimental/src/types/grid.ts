import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { DataRect } from "./api";

export interface GridSpec<
  Data = unknown,
  ColExt extends Record<string, any> = object,
  S extends RowSource<Data> = RowSource,
  Ext extends Record<string, any> = object,
> {
  readonly data?: Data;
  readonly column?: ColExt;
  readonly source?: S;
  readonly api?: Ext;
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
