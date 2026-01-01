import { Fragment, memo, useMemo, useState, type ReactNode } from "react";
import { PillRootProvider, type PillRootContext } from "./root.context.js";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { PillRowDefault } from "./row-default.js";

function PillRootImpl({ children = PillRowDefault, ...p }: PillManager.Props) {
  const [cloned, setCloned] = useState<PillRowSpec[] | null>(null);
  const value = useMemo<PillRootContext>(() => {
    return {
      orientation: p.orientation ?? "horizontal",
      wrappedRows: p.wrappedRows ?? true,
      wrappedRoot: p.wrappedRoot ?? true,
      cloned,
      setCloned,
      rows: p.rows,

      onActiveChange: p.onActiveChange ?? (() => {}),
    };
  }, [cloned, p.onActiveChange, p.orientation, p.rows, p.wrappedRoot, p.wrappedRows]);

  const rendered = useMemo(() => {
    const rows = cloned ?? p.rows;
    return rows.map((x, i) => <Fragment key={i}>{children(x, value)}</Fragment>);
  }, [children, cloned, p.rows, value]);

  return (
    <PillRootProvider value={value}>
      {value.wrappedRoot && <div data-ln-pill-root>{rendered}</div>}
      {!value.wrappedRoot && rendered}
    </PillRootProvider>
  );
}

export const PillManager = memo(PillRootImpl);

export namespace PillManager {
  export type Props = {
    readonly rows: PillRowSpec[];
    readonly orientation?: "horizontal" | "vertical";
    readonly wrappedRows?: boolean;
    readonly wrappedRoot?: boolean;
    readonly children?: (row: PillRowSpec, ctx: PillRootContext) => ReactNode;

    readonly onActiveChange?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;
  };
}
