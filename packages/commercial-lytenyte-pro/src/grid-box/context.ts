import { createContext, useContext } from "react";
import type { DropEventParams } from "../+types.js";

interface GridBoxContextValue {
  readonly accepted: string[];
  readonly orientation: "horizontal" | "vertical";
  readonly onRootDrop: (p: DropEventParams) => void;
}

export const GridBoxContext = createContext<GridBoxContextValue>({} as any);

export const useGridBoxContext = () => useContext(GridBoxContext);
