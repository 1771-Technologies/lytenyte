import { type PropsWithChildren } from "react";
import { context, type MultiSelectContext } from "./context.js";

export interface MultiSelectRootProps {
  readonly context: MultiSelectContext;
}

export function MultiSelectRoot({ context: c, children }: PropsWithChildren<MultiSelectRootProps>) {
  return <context.Provider value={c}>{children}</context.Provider>;
}
