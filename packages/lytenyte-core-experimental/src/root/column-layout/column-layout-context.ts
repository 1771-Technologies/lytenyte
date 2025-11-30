import { createContext, useContext } from "react";
import type { HeaderLayoutCell } from "../../types/layout";

export const columnLayoutContext = createContext<HeaderLayoutCell<any>[][]>([]);

export const useColumnLayout = () => useContext(columnLayoutContext);
