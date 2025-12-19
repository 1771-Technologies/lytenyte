import { createContext, useContext } from "react";

export const HeaderRowContext = createContext(0);
export const useHeaderRow = () => useContext(HeaderRowContext);
