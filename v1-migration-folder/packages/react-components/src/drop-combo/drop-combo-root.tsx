import { type PropsWithChildren } from "react";
import { context, type DropComboContext } from "./context.js";

export interface DropComboRootProps {
  readonly context: DropComboContext;
}

export function DropComboRoot({ context: c, children }: PropsWithChildren<DropComboRootProps>) {
  return <context.Provider value={c}>{children}</context.Provider>;
}
