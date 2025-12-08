import { createContext, useContext } from "react";
import type { LayoutRowWithCells } from "../../types/layout.js";
import type { RowNode } from "../../types/row.js";

export interface RowMeta {
  readonly row: RowNode<any> | null;
  readonly layout: LayoutRowWithCells<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;
  readonly bounds: [number, number];
}

export const RowContext = createContext<RowMeta>({
  row: null,
  layout: null as any,
  xPositions: new Uint32Array(),
  yPositions: new Uint32Array(),
  bounds: [0, 0],
});

export const useRowMeta = () => useContext(RowContext);
