import { createContext, useContext } from "react";
import type { Root } from "./root";
import type { GridEvents } from "../types/events";
import type { GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly rtl: boolean;

  readonly columnDoubleClickToAutosize: boolean;
  readonly columnMoveDragPlaceholder: Root.Props["columnMoveDragPlaceholder"];
  readonly columnGroupMoveDragPlaceholder: Root.Props["columnGroupMoveDragPlaceholder"];
  readonly onColumnMoveOutside: Root.Props["onColumnMoveOutside"];

  readonly styles: Props["styles"];

  readonly events: GridEvents<GridSpec>;

  readonly rowAlternateAttr: boolean;

  readonly selectActivator: Root.Props["rowSelectionActivator"];
}

const context = createContext<RootContextValue>({} as any);

export const RootContextProvider = context.Provider;
export const useRoot = () => useContext(context);
