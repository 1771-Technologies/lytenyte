import { createContext, useContext } from "react";
import { DEFAULT_ROW_SOURCE } from "../../constants.js";

export const RowSourceContext = createContext(DEFAULT_ROW_SOURCE);
export const useRowSource = () => useContext(RowSourceContext);
