import { context } from "@1771technologies/grid-provider";
import { useContext, type PropsWithChildren } from "react";
import type { GridProReact } from "./types";

export function useGrid() {
  return useContext(context) as GridProReact<any>;
}

export function GridProvider(p: PropsWithChildren<{ value: GridProReact<any> }>) {
  return <context.Provider value={p.value}>{p.children}</context.Provider>;
}
