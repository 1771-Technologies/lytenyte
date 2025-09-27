import { createContext, useContext } from "react";
import type { CellRendererFn, ColumnBase, RowLayout, RowNode } from "../../+types";

export interface RowMetaData {
  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly colBounds: [number, number];
  readonly row: RowNode<any> | null;
  readonly layout: RowLayout<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;
  readonly base: ColumnBase<any>;
  readonly renderers: Record<string, CellRendererFn<any>>;
  readonly rtl: boolean;
}

export const RowContext = createContext<RowMetaData>({
  selected: false,
  indeterminate: false,
  colBounds: [0, 0],
  row: null,
  layout: null as any,
  xPositions: new Uint32Array(),
  yPositions: new Uint32Array(),
  base: null as any,
  renderers: null as any,
  rtl: false,
});

export const useRowMeta = () => useContext(RowContext);
