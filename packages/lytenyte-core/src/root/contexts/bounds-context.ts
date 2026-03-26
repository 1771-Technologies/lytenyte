import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";

const boundsContext = createContext<SpanLayout>({} as any);
export const BoundsContextProvider = boundsContext.Provider;
export const useBounds = () => useContext(boundsContext);

const columnBounds = createContext<{
  colCenterStart: number;
  colCenterEnd: number;
  colStartEnd: number;
  colEndStart: number;
}>({} as any);

export const ColumnBoundsProvider = columnBounds.Provider;
export const useColumnBounds = () => useContext(columnBounds);
