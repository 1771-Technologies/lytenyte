import type { PropsWithChildren } from "react";
import { RowSourceContext } from "./context.js";
import type { Ln } from "../../types.js";

export function RowSourceProvider(props: PropsWithChildren<{ rowSource: Ln.RowSource }>) {
  return (
    <RowSourceContext.Provider value={props.rowSource}>{props.children}</RowSourceContext.Provider>
  );
}
