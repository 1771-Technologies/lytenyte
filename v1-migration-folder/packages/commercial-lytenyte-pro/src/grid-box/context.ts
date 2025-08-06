import { createContext, useContext } from "react";

interface GridBoxContextValue {
  readonly accepted: string[];
  readonly orientation: "horizontal" | "vertical";
}

export const GridBoxContext = createContext<GridBoxContextValue>({} as any);

export const useGridBoxContext = () => useContext(GridBoxContext);
