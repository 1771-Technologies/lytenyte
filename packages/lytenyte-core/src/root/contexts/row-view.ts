import type { RowLayout, RowView } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

const rowViewContext = createContext<RowView>({} as any);
export const RowViewContextProvider = rowViewContext.Provider;
export const useRowView = () => useContext(rowViewContext);

const rowLayoutContext = createContext<RowLayout>({} as any);
export const RowLayoutProvider = rowLayoutContext.Provider;
export const useRowLayout = () => useContext(rowLayoutContext);
