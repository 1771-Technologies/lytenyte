import { createContext, useContext } from "react";
import type { RowView } from "../../layout";

export const RowLayoutContext = createContext<RowView<any>>(null as any);
export const useRowLayout = () => useContext(RowLayoutContext);
