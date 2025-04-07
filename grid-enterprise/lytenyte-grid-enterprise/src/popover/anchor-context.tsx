import type { TargetPro } from "@1771technologies/grid-types/pro";
import { createContext, useContext, type PropsWithChildren } from "react";

const context = createContext<TargetPro | null>(null);

export function AnchorProvider(props: PropsWithChildren<{ anchor: TargetPro | null }>) {
  return <context.Provider value={props.anchor}>{props.children}</context.Provider>;
}
export const useAnchor = () => useContext(context);
