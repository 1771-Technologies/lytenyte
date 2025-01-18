import { context } from "@1771technologies/grid-provider";
import type { StoreCommunityReact } from "@1771technologies/grid-types";
import { useContext, type PropsWithChildren } from "react";

export function useGrid() {
  return useContext(context) as StoreCommunityReact<any>;
}

export function GridProvider(p: PropsWithChildren<{ value: StoreCommunityReact<any> }>) {
  return <context.Provider value={p.value}>{p.children}</context.Provider>;
}
