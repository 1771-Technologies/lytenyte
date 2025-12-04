import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { ColumnBase, ColumnMeta } from "../types/column";
import type { Piece } from "../hooks/use-piece";
import type { RowFullWidthRenderer } from "../types/row";
import type { API } from "./root";

export interface GridContextType {
  readonly id: string;
  readonly rtl: boolean;
  readonly setViewport: Dispatch<SetStateAction<HTMLDivElement | null>>;

  readonly headerHeightTotal: number;
  readonly headerHeight: number;
  readonly headerGroupHeight: number;
  readonly floatingRowHeight: number;
  readonly floatingRowEnabled: boolean;

  readonly rowFullWidthRenderer: Piece<RowFullWidthRenderer<any> | null>;
  readonly rowDetailExpansions: Piece<Set<string>>;

  readonly columnGroupExpansions: Record<string, boolean>;
  readonly columnGroupDefaultExpansion: boolean;
  readonly columnBase: ColumnBase<any>;

  readonly headerRowCount: number;

  readonly columnMeta: ColumnMeta<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;

  readonly vpInnerWidth: number;
  readonly vpInnerHeight: number;

  readonly api: API<any>;
}

export const GridContext = createContext<GridContextType>({} as GridContextType);
export const useGridRoot = () => useContext(GridContext);
