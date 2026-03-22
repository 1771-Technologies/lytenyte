import type { GridSections } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

const context = createContext<GridSections>({} as any);

export const GridSectionsProvider = context.Provider;
export const useGridSections = () => useContext(context);
