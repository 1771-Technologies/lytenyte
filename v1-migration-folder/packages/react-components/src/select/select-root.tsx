import { type PropsWithChildren } from "react";
import type { SelectContext } from "./context";
import { context } from "./context";

export interface SelectRootProps {
  readonly context: SelectContext;
}

export function SelectRoot({ context: c, children }: PropsWithChildren<SelectRootProps>) {
  return <context.Provider value={c}>{children}</context.Provider>;
}
