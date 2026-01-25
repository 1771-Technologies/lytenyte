import { forwardRef, useMemo, useState, type JSX, type PropsWithChildren } from "react";
import { PillRowProvider, type PillRowContext } from "./pill-row.context.js";
import type { PillRowSpec } from "./types.js";
import { usePillRoot } from "./root.context.js";

function PillRowBase(
  { row, children, ...props }: PropsWithChildren<PillRow.Props>,
  forwarded: JSX.IntrinsicElements["div"]["ref"],
) {
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
        <div {...props} ref={forwarded} data-ln-pill-row data-ln-expanded={expanded}>
          {children}
        </div>
      )}
      {!wrappedRows && children}
    </PillRowProvider>
  );
}

export const PillRow = forwardRef(PillRowBase);

export namespace PillRow {
  export type Props = { readonly row: PillRowSpec } & Omit<JSX.IntrinsicElements["div"], "ref">;
}
