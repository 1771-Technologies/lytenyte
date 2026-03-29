import { createContext, useContext } from "react";
import type { Root } from "./root";
import type { GridEvents } from "../types/events";
import type { GridSpec, Props } from "../types";

export interface RootContextValue {
  readonly rtl: boolean;

  readonly styles: Props["styles"];

  readonly events: GridEvents<GridSpec>;

  readonly rowAlternateAttr: boolean;
  readonly selectActivator: Root.Props["rowSelectionActivator"];
}

const context = createContext<RootContextValue>({} as any);

export const RootContextProvider = context.Provider;
export const useRoot = () => useContext(context);
