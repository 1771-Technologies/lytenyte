import { useMemo, useState, type PropsWithChildren } from "react";
import { PillRowProvider, type PillRowContext } from "./pill-row.context.js";
import type { PillRowSpec } from "./types.js";
import { usePillRoot } from "./root.context.js";

export function PillRow({ row, ...props }: PropsWithChildren<PillRow.Props>) {
  const { wrappedRows } = usePillRoot();
  const [expanded, setExpanded] = useState(false);

  const value = useMemo<PillRowContext>(() => {
    return {
      expanded,
      expandToggle: (s?: boolean) => {
        if (s != null) setExpanded(s);
        else setExpanded((prev) => !prev);
      },
      row,
    };
  }, [expanded, row]);

  return (
    <PillRowProvider value={value}>
      {wrappedRows && (
        <div data-ln-pill-row data-ln-expanded={expanded}>
          {props.children}
        </div>
      )}
      {!wrappedRows && props.children}
    </PillRowProvider>
  );
}

export namespace PillRow {
  export type Props = { readonly row: PillRowSpec };
}
