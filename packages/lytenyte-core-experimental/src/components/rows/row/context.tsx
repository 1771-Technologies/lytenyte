import type { LayoutRowWithCells, RowNode } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

export interface RowMeta {
  readonly row: RowNode<any> | null;
  readonly layout: LayoutRowWithCells<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;
}

export const RowContext = createContext<RowMeta>({
  row: null,
  layout: null as any,
  xPositions: new Uint32Array(),
  yPositions: new Uint32Array(),
});

export const useRowMeta = () => useContext(RowContext);
