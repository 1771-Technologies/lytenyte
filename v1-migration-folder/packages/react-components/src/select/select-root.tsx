import { type PropsWithChildren } from "react";
import type { SelectContext } from "./context.js";
import { context } from "./context.js";

export interface SelectRootProps {
  readonly context: SelectContext;
}

export function SelectRoot({ context: c, children }: PropsWithChildren<SelectRootProps>) {
  return <context.Provider value={c}>{children}</context.Provider>;
}
