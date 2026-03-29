import type { RowSource } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

const context = createContext(null as unknown as RowSource);
export const RowSourceProvider = context.Provider;
export const useRowSourceContext = () => useContext(context);
