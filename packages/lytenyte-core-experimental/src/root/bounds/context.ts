import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

export const boundsContext = createContext({} as SpanLayout);
export const useBounds = () => useContext(boundsContext);
