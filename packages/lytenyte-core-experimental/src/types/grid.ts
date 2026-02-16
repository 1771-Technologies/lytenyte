import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { CSSProperties } from "react";

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

export type GridStyle = {
  readonly viewport?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly row?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly header?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly detail?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly headerGroup?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
  readonly cell?: {
    readonly style?: CSSProperties;
    readonly className?: string;
  };
};
