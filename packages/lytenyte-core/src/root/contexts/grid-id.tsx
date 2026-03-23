import { createContext, useContext } from "react";

const context = createContext("");

export const GridIdProvider = context.Provider;
export const useGridId = () => useContext(context);
