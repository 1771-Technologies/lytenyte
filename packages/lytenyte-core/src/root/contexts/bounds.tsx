import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

const boundsContext = createContext<SpanLayout>({} as any);
export const BoundsContextProvider = boundsContext.Provider;
export const useBounds = () => useContext(boundsContext);

const startBoundsContext = createContext<[start: number, end: number]>(null as any);
export const StartBoundsProvider = startBoundsContext.Provider;
export const useStartBounds = () => useContext(startBoundsContext);
