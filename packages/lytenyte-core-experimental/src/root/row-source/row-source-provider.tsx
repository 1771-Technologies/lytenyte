import type { PropsWithChildren } from "react";
import type { RowSource } from "../../types/row";
import { RowSourceContext } from "./context.js";

export function RowSourceProvider(props: PropsWithChildren<{ rowSource: RowSource }>) {
  return (
    <RowSourceContext.Provider value={props.rowSource}>{props.children}</RowSourceContext.Provider>
  );
}
