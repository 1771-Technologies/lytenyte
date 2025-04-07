import { context } from "@1771technologies/grid-provider";
import type { GridCoreReact } from "@1771technologies/grid-types/core-react";
import { useContext, type PropsWithChildren } from "react";

export function useGrid() {
  return useContext(context) as GridCoreReact<any>;
}

export function GridProvider(p: PropsWithChildren<{ value: GridCoreReact<any> }>) {
  return <context.Provider value={p.value}>{p.children}</context.Provider>;
}
