import { Fragment, memo, useMemo, useRef, useState, type ReactNode } from "react";
import { PillRootProvider, type PillRootContext } from "./root.context.js";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { PillRowDefault } from "./row-default.js";

function PillRootImpl({ children = PillRowDefault, ...p }: PillManager.Props) {
  const [cloned, setCloned] = useState<PillRowSpec[] | null>(null);
  const [dragState, setDragState] = useState<{
    readonly activeId: string;
    readonly activeRow: string;
    readonly activeType: string;
  } | null>(null);

  const prevSwapId = useRef<string | null>(null);
  const prevRowId = useRef<string | null>(null);
  const movedRef = useRef<{ id: string; pillId: string } | null>(null);

  const value = useMemo<PillRootContext>(() => {
    return {
      orientation: p.orientation ?? "horizontal",
      wrappedRows: p.wrappedRows ?? true,
      wrappedRoot: p.wrappedRoot ?? true,
      cloned,
      setCloned,
      rows: p.rows,

      dragState,
      setDragState,

      movedRef,
      prevSwapId,
      prevRowId,

      onPillItemActiveChange: p.onPillItemActiveChange ?? (() => {}),
      onPillRowChange: p.onPillRowChange ?? (() => {}),
      onPillItemThrown: p.onPillItemThrown ?? (() => {}),
    };
  }, [
    cloned,
    dragState,
    p.onPillItemActiveChange,
    p.onPillItemThrown,
    p.onPillRowChange,
    p.orientation,
    p.rows,
    p.wrappedRoot,
    p.wrappedRows,
  ]);

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

    readonly onPillRowChange?: (params: {
      readonly changed: PillRowSpec[];
      readonly full: PillRowSpec[];
    }) => void;

    readonly onPillItemActiveChange?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;

    readonly onPillItemThrown?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;
  };
}
