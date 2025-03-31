import type { Target } from "@1771technologies/grid-types/enterprise";
import { createContext, useContext, type PropsWithChildren } from "react";

const context = createContext<Target | null>(null);

export function AnchorProvider(props: PropsWithChildren<{ anchor: Target | null }>) {
  return <context.Provider value={props.anchor}>{props.children}</context.Provider>;
}
export const useAnchor = () => useContext(context);
