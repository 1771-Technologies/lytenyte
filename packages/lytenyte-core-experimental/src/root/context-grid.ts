import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { ColumnBase, ColumnMeta } from "../types/column";

export interface GridContextType {
  readonly id: string;
  readonly rtl: boolean;
  readonly setViewport: Dispatch<SetStateAction<HTMLDivElement | null>>;

  readonly headerHeight: number;
  readonly headerGroupHeight: number;
  readonly floatingRowHeight: number;
  readonly floatingRowEnabled: boolean;

  readonly columnGroupExpansions: Record<string, boolean>;
  readonly columnGroupDefaultExpansion: boolean;
  readonly columnBase: ColumnBase<any>;

  readonly headerRowCount: number;

  readonly columnMeta: ColumnMeta<any>;
  readonly xPositions: Uint32Array;
}

export const GridContext = createContext<GridContextType>({} as GridContextType);
export const useGridRoot = () => useContext(GridContext);
