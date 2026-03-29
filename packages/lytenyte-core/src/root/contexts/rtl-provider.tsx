import { createContext, useContext } from "react";

const context = createContext(false);
export const RTLProvider = context.Provider;
export const useRtlContext = () => useContext(context);
