import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { RowDetailRenderer, RowNode } from "../../types/row";

export type RowDetailAutoHeightCache = Record<string, number>;

export interface RowDetailContext {
  readonly rowDetailHeight: number | "auto";
  readonly autoHeightCache: RowDetailAutoHeightCache;
  readonly setAutoHeightCache: Dispatch<SetStateAction<RowDetailAutoHeightCache>>;
  readonly getRowDetailHeight: (rowOrId: RowNode<any> | string) => number;

  readonly detailExpansions: Set<string>;
  readonly onRowDetailExpansionsChange: (change: Set<string>) => void;

  readonly rowDetailRenderer: RowDetailRenderer<any> | null;
}

export const RowDetailContext = createContext<RowDetailContext>({} as any);
export const useRowDetailContext = () => useContext(RowDetailContext);
