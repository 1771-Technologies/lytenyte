import { createContext, useContext } from "react";
import type { HeaderLayoutCell } from "../../layout";

export const columnLayoutContext = createContext<HeaderLayoutCell<any>[][]>([]);

export const useColumnLayout = () => useContext(columnLayoutContext);
