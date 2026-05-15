import { createContext, useContext } from "react";

const context = createContext<"ltr" | "rtl">("ltr");
export const useDirection = () => useContext(context);
export const DirectionProvider = context.Provider;
