import { createContext, useContext } from "react";

export interface ListboxContext {
  readonly orientation: "horizontal" | "vertical";
  readonly rtl: boolean;
}

export const context = createContext<ListboxContext>({ orientation: "vertical", rtl: false });

export const useListboxContext = () => useContext(context);
